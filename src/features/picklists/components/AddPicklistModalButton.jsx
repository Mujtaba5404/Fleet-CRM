// import AddButton from "../../../components/AddButton";
// import CanAccess from "../../../components/CanAccess";
// import PICKLIST_SCOPE from "../../../constants/PICKLIST_SCOPE";
// import { usePicklists } from "../../../context/PicklistContext";

// const AddPicklistModalButton = () => {
//   const { featureName, scope, resource, openCreateModal } = usePicklists();

//   return (
//     <CanAccess resource={scope === PICKLIST_SCOPE.RESOURCE ? resource : "picklist"} action="create">
//       <AddButton title={`create ${featureName}`} subtitle={`add a new ${featureName}`} onClick={openCreateModal} />
//     </CanAccess>
//   );
// };

// export default AddPicklistModalButton;
import AddButton from "../../../components/AddButton";
import { usePicklists } from "../../../context/PicklistContext";

const AddPicklistModalButton = () => {
  const { featureName, openCreateModal } = usePicklists();

  return <AddButton title={`create ${featureName}`} subtitle={`add a new ${featureName}`} onClick={openCreateModal} />;
};

export default AddPicklistModalButton;