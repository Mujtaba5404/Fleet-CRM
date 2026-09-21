import Picklists from "src/features/picklists/Picklists";

const SubscriptionStatus = () => {
  return (
    <Picklists featureName="subscription status" resource="Subscription" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default SubscriptionStatus;
