import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbDiningCommonsMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitem/post",
    method: "POST",
    params: {
     diningCommonsCode: ucsbDiningCommonsMenuItem.diningCommonsCode,
     name: ucsbDiningCommonsMenuItem.name,
     station: ucsbDiningCommonsMenuItem.station,
    }
  });

  const onSuccess = (ucsbDiningCommonsMenuItem) => {
    toast(`New ucsbDiningCommonsMenuItem Created - id: ${ucsbDiningCommonsMenuItem.id} diningCommonsCode: ${ucsbDiningCommonsMenuItem.diningCommonsCode} name: ${ucsbDiningCommonsMenuItem.name} station: ${ucsbDiningCommonsMenuItem.station}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbdiningcommonsmenuitem/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitem" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New DiningCommonsMenuItem</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
