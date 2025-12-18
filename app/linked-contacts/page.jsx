import { CVPage, CVPageDetail, CVPageList } from '@/components/cv-page'

export const metadata = {
  title: 'Linked Contacts'
}

export default function LinkedContactsPage() {
  return (
    <CVPage srTitle="Linked Contacts">
      <CVPageList srTitle="Contacts list">
        <div>List</div>
      </CVPageList>

      <CVPageDetail srTitle="Selected contact">
        <div>Detail</div>
      </CVPageDetail>
    </CVPage>
  )
}
