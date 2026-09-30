import { Button } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconFileExport } from "@tabler/icons-react";
import { useState } from "react";
import api from "../api/index";

const ExportButton = ({ title, apiEndpoint, params = {} }) => {
  const [globalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await api.get(apiEndpoint, {
        params: { query: { ...globalFilters, ...params } },
        responseType: "blob",
      });

      const url = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers["content-disposition"];

      const filename =
        disposition?.match(/filename="?(.+)"?/)?.[1] ?? "export.xlsx";

      link.download = filename;

      link.click();

      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      loading={isExporting}
      onClick={handleExport}
      leftSection={<IconFileExport size={18} />}
    >
      {title}
    </Button>
  );
};

export default ExportButton;
