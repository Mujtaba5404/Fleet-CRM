import Select from "../../components/Select";
import useAuthCompanies from "./useAuthCompanies";

/** Company picker fed by the companies in the signed-in user's session. */
const CompaniesSelect = ({ selectProps = {} }) => {
  const companies = useAuthCompanies();

  return (
    <Select
      data={companies}
      selectLabel="title"
      selectValue="_id"
      searchable
      clearable
      nothingFoundMessage="No companies found"
      {...selectProps}
      {...(!companies.length && {
        disabled: true,
        placeholder: "No companies on your account",
      })}
    />
  );
};

export default CompaniesSelect;
