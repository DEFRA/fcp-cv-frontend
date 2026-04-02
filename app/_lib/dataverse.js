import { config } from '@/config'

const dataverseUrl = config.get('dataverse.url')

async function lookupEntity(
  entityType,
  filterField,
  filterValue,
  idField,
  accessToken,
  notFoundMessage = 'Entity not found'
) {
  const response = await fetch(
    `${dataverseUrl}/${entityType}?$filter=${filterField} eq '${filterValue}'&$select=${idField}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  const data = await response.json()

  if (!data.value || data.value.length === 0) {
    return { error: notFoundMessage }
  }

  const entityId = data.value[0][idField]
  return { id: entityId }
}

export async function lookupContactIdByCrn(crn, accessToken) {
  return lookupEntity(
    'contacts',
    'rpa_capcustomerid',
    crn,
    'contactid',
    accessToken,
    'Contact not found'
  )
}

export async function lookupAccountIdBySbi(sbi, accessToken) {
  return lookupEntity(
    'accounts',
    'rpa_sbinumber',
    sbi,
    'accountid',
    accessToken,
    'Account not found'
  )
}
