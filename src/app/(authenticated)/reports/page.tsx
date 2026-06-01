'use client'

import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ContextStorage } from '@/store'
import { ReportsComponent } from '@/components/reports'

export default function Page() {
  const { t } = useTranslation()
  const store = useContext(ContextStorage)
  const planAllowed = (store.profile?.plan || 'free') !== 'free'

  if (!planAllowed) {
    return (
      <div className="paddingAllSmall">
        <h2>{t('general.plan.upsell.title')}</h2>
        <p>{t('general.plan.upgrade.intermediate')}</p>
      </div>
    )
  }

  return <ReportsComponent />
}
