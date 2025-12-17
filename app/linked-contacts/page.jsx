import {
  ListDetailView,
  ListDetailViewSection
} from '../components/list-detail-view'

export const metadata = {
  title: 'Linked Contacts'
}

export default function LinkedContactsPage() {
  return (
    <ListDetailView srTitle="Linked Contacts">
      <ListDetailViewSection srTitle="Contacts list">
        <div>List</div>
      </ListDetailViewSection>

      <ListDetailViewSection srTitle="Selected contact">
        <div>Detail</div>
      </ListDetailViewSection>
    </ListDetailView>
  )
}
