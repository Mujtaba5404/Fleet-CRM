import Picklists from "src/features/picklists/Picklists";

const SubscriptionServiceProviders = () => {
  return (
    <Picklists featureName="subscription service provider" resource="Subscription" field="serviceProvider">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default SubscriptionServiceProviders;
