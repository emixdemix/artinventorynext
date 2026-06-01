'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ContextStorage } from '../store'
import { UserPlan } from '../interfaces'
import { Modal } from './modal'
import { createDodoCheckout, emitStore, getProfile } from './utility'
import { DodoPayments } from 'dodopayments-checkout'

const PLANS: UserPlan[] = ['free', 'intermediate', 'full']
const PLAN_TIER: Record<UserPlan, number> = { free: 0, intermediate: 1, full: 2 }

export const Plan = () => {
   const { t } = useTranslation()
   const router = useRouter()
   const searchParams = useSearchParams()
   const store = useContext(ContextStorage)
   const currentPlan = (store.profile?.plan || 'free') as UserPlan
   const [switching, setSwitching] = useState<UserPlan | null>(null)
   const [error, setError] = useState('')
   const [checkoutResult, setCheckoutResult] = useState<'success' | 'failed' | null>(null)
   const [comingSoon, setComingSoon] = useState(false)
   const checkoutCompletedRef = useRef(false)
   const dodoInitializedRef = useRef(false)

   const dodoEnabled = process.env.NEXT_PUBLIC_DODO_ENABLED === 'true'
   const dodoMode: 'test' | 'live' =
      process.env.NEXT_PUBLIC_DODO_MODE === 'live' ? 'live' : 'test'

   useEffect(() => {
      if (!dodoEnabled || dodoInitializedRef.current) return
      dodoInitializedRef.current = true
      DodoPayments.Initialize({
         mode: dodoMode,
         displayType: 'overlay',
         onEvent: (event) => {
            const status = (event.data as { status?: string } | undefined)?.status ?? ''
            if (
               event.event_type === 'checkout.redirect' ||
               (event.event_type === 'checkout.status' && status === 'succeeded')
            ) {
               checkoutCompletedRef.current = true
               setCheckoutResult('success')
               getProfile().then((profile) => {
                  emitStore({ key: 'profile', value: profile, store: true })
               })
               return
            }
            if (event.event_type === 'checkout.error') {
               setCheckoutResult('failed')
               return
            }
            if (event.event_type === 'checkout.closed') {
               if (!checkoutCompletedRef.current) {
                  setCheckoutResult('failed')
               }
            }
         },
      })
   }, [dodoEnabled, dodoMode])

   useEffect(() => {
      if (searchParams.get('dodo') === 'success') {
         setCheckoutResult('success')
         getProfile().then((profile) => {
            emitStore({ key: 'profile', value: profile, store: true })
         })
      }
   }, [searchParams])

   const handleUpgrade = async (plan: UserPlan) => {
      if (plan === 'free') return
      setError('')
      if (!dodoEnabled) {
         setComingSoon(true)
         return
      }
      setSwitching(plan)
      try {
         const result = await createDodoCheckout(plan as 'intermediate' | 'full')
         if ('error' in result) {
            setError(t('general.plan.error'))
            return
         }
         checkoutCompletedRef.current = false
         DodoPayments.Checkout.open({ checkoutUrl: result.checkoutUrl })
      } finally {
         setSwitching(null)
      }
   }

   const planTitle = (plan: UserPlan) =>
      plan === 'full'
         ? t('general.plan.full')
         : plan === 'intermediate'
            ? t('general.plan.intermediate')
            : t('general.plan.free')

   const planDescription = (plan: UserPlan) => t(`general.plan.description.${plan}`)
   const planAmount = (plan: UserPlan) => t(`general.plan.amount.${plan}`)
   const planFeatures = (plan: UserPlan) => {
      const items = t(`general.plan.features.${plan}`, { returnObjects: true }) as unknown
      return Array.isArray(items) ? (items as string[]) : []
   }
   const planFeaturesIntro = (plan: UserPlan) => {
      const key = `general.plan.featuresIntro.${plan}`
      const value = t(key)
      return value === key ? '' : value
   }

   return (
      <section className="settings paddingAllSmall">
         <p className="strong paddingV">{t('general.plan.changeTitle')}</p>

         <div className="planGrid">
            {PLANS.map((plan) => {
               const active = plan === currentPlan
               const isUpgrade = PLAN_TIER[plan] > PLAN_TIER[currentPlan]
               const isSwitching = switching === plan
               return (
                  <div
                     key={plan}
                     className={`planCard${active ? ' planCardActive' : ''}`}
                  >
                     <div className="planHeader">
                        <h3 className="strong">{planTitle(plan)}</h3>
                        <span className="planAmount">
                           {planAmount(plan)}
                           {plan !== 'free' && <span className="planPeriod"> {t('general.plan.period')}</span>}
                        </span>
                     </div>
                     <p className="planDescription">{planDescription(plan)}</p>
                     {planFeaturesIntro(plan) && (
                        <p className="planFeaturesIntro">{planFeaturesIntro(plan)}</p>
                     )}
                     {planFeatures(plan).length > 0 && (
                        <ul className="planFeatures">
                           {planFeatures(plan).map((feature, idx) => (
                              <li key={idx}>
                                 <svg
                                    className="planFeatureIcon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                 >
                                    <polyline points="20 6 9 17 4 12" />
                                 </svg>
                                 <span>{feature}</span>
                              </li>
                           ))}
                        </ul>
                     )}
                     <div className="planAction">
                        {active ? (
                           <button className="secondaryButton" disabled>
                              {t('general.plan.currentBadge')}
                           </button>
                        ) : isUpgrade ? (
                           <button
                              className="primaryButton"
                              onClick={() => handleUpgrade(plan)}
                              disabled={isSwitching || switching !== null}
                           >
                              {isSwitching
                                 ? t('general.plan.switching')
                                 : t('general.plan.upgradeTo', { plan: planTitle(plan) })}
                           </button>
                        ) : null}
                     </div>
                  </div>
               )
            })}
         </div>

         {error && <p className="smallerText error paddingV">{error}</p>}

         <Modal
            title={t(checkoutResult === 'success' ? 'general.plan.thankYouTitle' : 'general.plan.failedTitle')}
            closeicon={''}
            visible={checkoutResult !== null}
            onClose={() => setCheckoutResult(null)}
         >
            <p>
               {t(checkoutResult === 'success' ? 'general.plan.thankYouMessage' : 'general.plan.failedMessage')}
            </p>
            <div className="buttonblock">
               <button
                  className="primaryButton"
                  onClick={() => {
                     setCheckoutResult(null)
                     if (checkoutResult === 'success') router.refresh()
                  }}
               >
                  {t('general.plan.upsell.close')}
               </button>
            </div>
         </Modal>

         <Modal
            title={t('general.plan.comingSoonTitle')}
            closeicon={''}
            visible={comingSoon}
            onClose={() => setComingSoon(false)}
         >
            <p>{t('general.plan.comingSoonMessage')}</p>
            <div className="buttonblock">
               <button className="primaryButton" onClick={() => setComingSoon(false)}>
                  {t('general.plan.upsell.close')}
               </button>
            </div>
         </Modal>
      </section>
   )
}
