import {
  CVPage,
  CVPageFullWidth,
  CVPageLeftColumn,
  CVPageRightColumn
} from '@/components/cv-page'

export const metadata = {
  title: 'Linked Contacts'
}

export default function LinkedContactsPage() {
  return (
    <CVPage srTitle="Linked Contacts">
      <CVPageFullWidth srTitle="Contacts list">
        <div>Full</div>
      </CVPageFullWidth>
      <CVPageLeftColumn srTitle="Contacts list">
        <div>List</div>
      </CVPageLeftColumn>
      <CVPageRightColumn srTitle="Contacts list">
        <div>Detail</div>
      </CVPageRightColumn>
    </CVPage>
  )
}
