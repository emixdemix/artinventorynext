import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AdminLogin, AdminUser, AdminUserDetail } from '../interfaces'
import {
  checkSession,
  emitStore,
  getAdminLogins,
  getAdminUserDetail,
  getAdminUsers,
  getProfile,
} from './utility'
import { Spinner } from './waiting'
import { Modal } from './modal'

type AdminSection = 'overview' | 'users'

interface MenuItem {
  id: AdminSection
  labelKey: string
  icon: ReactNode
}

const OverviewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
)

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MENU: MenuItem[] = [
  { id: 'overview', labelKey: 'general.admin.sidebar.overview', icon: <OverviewIcon /> },
  { id: 'users', labelKey: 'general.admin.sidebar.users', icon: <UsersIcon /> },
]

const formatLoginDate = (ts: number, locale: string) => {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return new Date(ts).toISOString()
  }
}

const Overview = () => {
  const { t, i18n } = useTranslation()
  const [logins, setLogins] = useState<AdminLogin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAdminLogins(20).then(list => {
      setLogins(list)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <header className="adminContentHeader">
        <h1>{t('general.admin.overview.title')}</h1>
        <p className="smallText">{t('general.admin.overview.description')}</p>
      </header>
      <section className="adminTableWrapper">
        <div className="adminSectionHeader">
          <h2>{t('general.admin.overview.latestLogins')}</h2>
        </div>
        {loading ? (
          <div className="adminTableEmpty">
            <Spinner />
          </div>
        ) : logins.length === 0 ? (
          <div className="adminTableEmpty">
            <p className="center smallText">{t('general.admin.overview.loginsEmpty')}</p>
          </div>
        ) : (
          <table className="adminTable">
            <thead>
              <tr>
                <th>{t('general.admin.overview.column.email')}</th>
                <th>{t('general.admin.overview.column.time')}</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((entry, idx) => (
                <tr key={`${entry.createdAt}-${idx}`}>
                  <td>{entry.email || '-'}</td>
                  <td>{formatLoginDate(entry.createdAt, i18n.language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}

interface UserDetailModalProps {
  userId: string | null
  onClose: () => void
}

const UserDetailModal = ({ userId, onClose }: UserDetailModalProps) => {
  const { t } = useTranslation()
  const [detail, setDetail] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) {
      setDetail(null)
      return
    }
    setLoading(true)
    setDetail(null)
    getAdminUserDetail(userId).then(result => {
      setDetail(result)
      setLoading(false)
    })
  }, [userId])

  const stats = [
    { key: 'artpieces', value: detail?.counts.artpieces ?? 0 },
    { key: 'media', value: detail?.counts.media ?? 0 },
    { key: 'shows', value: detail?.counts.shows ?? 0 },
    { key: 'customers', value: detail?.counts.customers ?? 0 },
  ]

  return (
    <Modal
      title={t('general.admin.userDetail.title')}
      closeicon=""
      visible={userId !== null}
      onClose={onClose}
    >
      {loading ? (
        <div className="adminTableEmpty">
          <Spinner />
        </div>
      ) : !detail ? (
        <p className="smallText">{t('general.admin.userDetail.notFound')}</p>
      ) : (
        <section className="adminUserDetail">
          <div className="adminUserDetailMeta">
            <p className="smallText">
              <strong>{t('general.admin.users.column.email')}:</strong> {detail.email || '-'}
            </p>
            <p className="smallText">
              <strong>{t('general.admin.users.column.name')}:</strong> {detail.name || '-'}
            </p>
            <p className="smallText">
              <strong>{t('general.admin.users.column.plan')}:</strong>{' '}
              <span className={`planTag plan-${detail.plan}`}>{detail.plan}</span>
            </p>
          </div>
          <div className="adminStatGrid">
            {stats.map(s => (
              <div key={s.key} className="adminStatCard">
                <p className="adminStatValue">{s.value}</p>
                <p className="adminStatLabel">{t(`general.admin.userDetail.stat.${s.key}`)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Modal>
  )
}

const UsersView = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getAdminUsers().then(list => {
      setUsers(list)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <header className="adminContentHeader">
        <h1>{t('general.admin.users.title')}</h1>
        <p className="smallText">
          {t('general.admin.users.description', { count: users.length })}
        </p>
      </header>
      <section className="adminTableWrapper">
        {loading ? (
          <div className="adminTableEmpty">
            <Spinner />
          </div>
        ) : users.length === 0 ? (
          <div className="adminTableEmpty">
            <p className="center smallText">{t('general.admin.users.empty')}</p>
          </div>
        ) : (
          <table className="adminTable">
            <thead>
              <tr>
                <th>{t('general.admin.users.column.id')}</th>
                <th>{t('general.admin.users.column.email')}</th>
                <th>{t('general.admin.users.column.name')}</th>
                <th>{t('general.admin.users.column.plan')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.id}
                  className="adminTableRowClickable"
                  onClick={() => setSelectedId(u.id)}
                >
                  <td className="monospace smallerText">{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.name || '-'}</td>
                  <td>
                    <span className={`planTag plan-${u.plan}`}>{u.plan}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <UserDetailModal userId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  )
}

export const AdminDashboard = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [checking, setChecking] = useState(true)
  const [active, setActive] = useState<AdminSection>('overview')

  useEffect(() => {
    checkSession().then(valid => {
      if (!valid) {
        router.push('/login')
        return
      }
      getProfile().then(profile => {
        emitStore({ key: 'profile', value: profile, store: true })
        if (!profile || profile.admin !== true) {
          router.push('/home')
          return
        }
        setChecking(false)
      })
    })
  }, [])

  if (checking) {
    return <Spinner />
  }

  return (
    <section className="adminShell">
      <aside className="adminSidebar">
        <nav className="adminSidebarNav">
          {MENU.map(item => {
            const label = t(item.labelKey)
            return (
              <button
                key={item.id}
                type="button"
                className={`adminSidebarItem ${active === item.id ? 'active' : ''}`}
                onClick={() => setActive(item.id)}
                title={label}
                aria-label={label}
              >
                <span className="adminSidebarIcon">{item.icon}</span>
                <span className="adminSidebarLabel">{label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
      <section className="adminContent">
        {active === 'overview' && <Overview />}
        {active === 'users' && <UsersView />}
      </section>
    </section>
  )
}
