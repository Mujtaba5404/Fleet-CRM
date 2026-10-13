import PageHeader from "../components/PageHeader";
import AccessTable from "../features/access/AccessTable";
import AddAccessButton from "../features/access/AddAccessButton";

const AccessPage = () => (
  <>
    <PageHeader
      title="Access"
      description="Who can sign in to Fleet and which role they hold. A user only sees the screens and actions their role allows."
      actions={<AddAccessButton />}
    />

    <AccessTable />
  </>
);

export default AccessPage;
