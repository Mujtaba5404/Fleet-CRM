import Picklists from "src/features/picklists/Picklists";

const SubscriptionServiceTypes = () => {
  return (
    <Picklists featureName="subscription service type" resource="Subscription" field="serviceType">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default SubscriptionServiceTypes;
