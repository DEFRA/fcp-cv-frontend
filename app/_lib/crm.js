import { config } from '@/config'

const crmBaseUrl = config.get('crm.baseUrl')
const crmAppId = config.get('crm.appId')

function createCrmEntityUrl(entityType, entityId) {
  const url = new URL(`${crmBaseUrl}/main.aspx`)
  url.searchParams.set('appid', crmAppId)
  url.searchParams.set('pagetype', 'entityrecord')
  url.searchParams.set('etn', entityType)
  url.searchParams.set('id', entityId)
  return url.toString()
}

export function getCrmContactUrl(contactId) {
  return createCrmEntityUrl('contact', contactId)
}

export function getCrmAccountUrl(accountId) {
  return createCrmEntityUrl('account', accountId)
}
