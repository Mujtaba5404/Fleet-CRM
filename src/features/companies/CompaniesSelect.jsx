import { Loader } from "@mantine/core";
import { useGetAllCompaniesQuery } from "../../api/company";
import Select from "../../components/Select";

const CompaniesSelect = ({ selectProps = {}, queryObject = {} }) => {
  const companies = useGetAllCompaniesQuery({ query: queryObject });

  return (
    <Select
      data={companies.data}
      selectLabel="title"
      selectValue="_id"
      searchable
      clearable
      rightSection={companies.isLoading && <Loader size={18} />}
      {...selectProps}
      {...(companies.isError && {
        disabled: true,
        placeholder: "Error loading companies",
      })}
    />
  );
};

export default CompaniesSelect;
