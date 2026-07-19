import { ServiceForm } from "../../../../../components/technicians/service-form";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Add service
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        List a new service for customers to book.
      </p>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
