import ListToolbar from "../components/ListToolbar";
import PageHeader from "../components/PageHeader";
import AddRoleModalButton from "../features/roles/AddRoleModalButton";
import RoleTable from "../features/roles/RoleTable";

const FILTER_LABELS = {
  title: "Name",
};

const RolesPage = () => (
  <>
    <PageHeader
      title="Roles & permissions"
      description="Decide what each kind of user can see and change across the CRM."
      breadcrumbs={[{ label: "Configuration" }, { label: "Roles" }]}
      actions={<AddRoleModalButton />}
    />

    <RoleTable
      toolbar={({ totalRecords, isLoading }) => (
        <ListToolbar
          totalRecords={totalRecords}
          isLoading={isLoading}
          noun="role"
          search={{ key: "title", placeholder: "Search by role name…" }}
          filterLabels={FILTER_LABELS}
        />
      )}
    />
  </>
);

export default RolesPage;
