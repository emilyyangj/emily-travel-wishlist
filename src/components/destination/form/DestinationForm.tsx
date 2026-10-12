 import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDestination } from "@/services/destinationService";
import { destinationQueryKey } from "@/lib/queryKeys";
import styles from "./DestinationForm.module.css";

const destinationSchema = z.object({
  city: z.string().trim().min(1, "City is required."),
  country: z.string().trim().min(1, "Country is required."),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

export function DestinationForm() {
  
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      city: "",
      country: "",
    },
  });

  const addDestinationMutation = useMutation({
    mutationFn: addDestination,
    onSuccess: async () => {
      reset();
      await queryClient.invalidateQueries({
        queryKey: destinationQueryKey,
      });
    },
  });

  function onSubmit(values: DestinationFormValues) {
    addDestinationMutation.mutate(values);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a destination</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.fieldGroup}>
            <Label htmlFor="city">City</Label>

            <Input
              id="city"
              placeholder="Chicago"
              autoComplete="address-level2"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : undefined}
              {...register("city")}
            />


            {errors.city ? (
              <p
                id="city-error"
                className="text-sm font-medium text-red-700"
                role="alert"
              >
                {errors.city.message}
              </p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <Label htmlFor="country">Country</Label>

            <Input
              id="country"
              placeholder="United States"
              autoComplete="country-name"
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? "country-error" : undefined}
              {...register("country")}
            />

            {errors.country ? (
              <p
                id="country-error"
                className="text-sm font-medium text-red-700"
                role="alert"
              >
                {errors.country.message}
              </p>
            ) : null}
          </div>

          {addDestinationMutation.error ? (
            <p
              className={styles.submitError}
              role="alert"
            >
              {addDestinationMutation.error.message}
            </p>
          ) : null}

          <Button
            className={styles.submitButton}
            type="submit"
            disabled={addDestinationMutation.isPending}
          >
            {addDestinationMutation.isPending
              ? "Adding destination..."
              : "Add destination"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );


  /*return (
    <Card>
      <CardHeader>
        <CardTitle>Add a destination</CardTitle>
      </CardHeader>

      <CardContent>
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>
            Complete the tutorial steps to build the destination form.
          </p>
        </div>
      </CardContent>
    </Card>
  );*/ 
}