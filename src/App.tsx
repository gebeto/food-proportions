import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  InputAdornment,
  Slider as Slider_,
  SliderProps,
  TextField as TextField_,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Add, Start } from "@mui/icons-material";
import * as Yup from "yup";

import { Formik, FieldArray, useField } from "formik";

function TextField(props: TextFieldProps) {
  const [field, meta] = useField(props.name || "");

  return (
    <TextField_
      {...props}
      {...field}
      error={!!meta.error}
      helperText={meta.error}
    />
  );
}

function Slider(props: SliderProps) {
  const [_field, _meta, helpers] = useField(props.name || "");

  return (
    <Slider_
      {...props}
      value={_field.value}
      onChange={(e, newValue) => {
        helpers.setValue(newValue);
      }}
    />
  );
}

function FoodRow({
  name,
  label,
  proportion,
  gramsPerDay,
  tooMuch,
}: {
  name: string;
  label: string;
  proportion: number;
  gramsPerDay: number;
  tooMuch: boolean;
}) {
  return (
    <Box>
      <Stack spacing={1}>
        <Typography variant="subtitle1">{label}</Typography>
        <TextField
          name={`${name}.name`}
          variant="outlined"
          size="small"
          label="Name"
        />
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          alignItems="center"
        >
          <TextField
            fullWidth
            name={`${name}.gramsPerDay`}
            variant="outlined"
            size="small"
            label="Grams per day"
            placeholder="700"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              type: "number",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">grams</InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            name={`${name}.gramsPerMeal`}
            variant="outlined"
            size="small"
            label="Grams per meal"
            placeholder="350"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              type: "number",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">grams</InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          alignItems="center"
        >
          <Slider
            color={tooMuch ? "secondary" : "primary"}
            name={`${name}.proportion`}
            min={0}
            max={100}
          />
          <Stack textAlign="center" direction="column" width="100px">
            <Typography whiteSpace="nowrap">
              {Math.round((gramsPerDay / 100) * proportion)}g
            </Typography>
            <Typography whiteSpace="nowrap">{proportion}%</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

const foodSchema = Yup.object().shape({
  food: Yup.array(
    Yup.object().shape({
      name: Yup.string().required("Required"),
      proportion: Yup.number(),
      gramsPerDay: Yup.number()
        .min(1, "must be greater than or equal to 1")
        .required("Required"),
    })
  ),
});

export function App() {
  const [value, setValue] = React.useState([11, 20, 30]);

  return (
    <Box pt={{ xs: 1, md: 6 }} display="flex" justifyContent="center">
      <Box width="min(400px, 100%)">
        <Formik
          initialValues={{
            food: [{ id: 0, name: "", proportion: 100, gramsPerDay: 0 }],
          }}
          validationSchema={foodSchema}
          onSubmit={(values) => {
            console.log(" >>> OH MY GOD", values);
          }}
        >
          {(formik) => (
            <Card variant="outlined" style={{ overflow: "visible" }}>
              <CardContent>
                <Box mb={2}>
                  <Typography fontWeight="600" variant="h5">
                    Food Proportions
                  </Typography>
                </Box>
                <FieldArray
                  name="food"
                  render={(pr) => {
                    return (
                      <Stack
                        divider={<Divider orientation="horizontal" flexItem />}
                        spacing={2}
                      >
                        {formik.values.food.map((f, i) => {
                          return (
                            <FoodRow
                              key={f.id.toString()}
                              name={`food[${i}]`}
                              label={`Food ${i}`}
                              proportion={f.proportion}
                              gramsPerDay={f.gramsPerDay}
                              tooMuch={
                                formik.values.food
                                  .slice(0, i + 1)
                                  .reduce(
                                    (prev, curr) => prev + curr.proportion,
                                    0
                                  ) > 100
                              }
                            />
                          );
                        })}
                        <Button
                          endIcon={<Add />}
                          size="large"
                          onClick={() => {
                            const allowedProportions =
                              100 -
                              formik.values.food.reduce(
                                (prev, curr) => prev + curr.proportion,
                                0
                              );
                            pr.push({
                              id: Date.now(),
                              proportion:
                                allowedProportions < 0 ? 0 : allowedProportions,
                              name: "",
                              gramsPerDay: 0,
                            });
                          }}
                        >
                          Add food
                        </Button>
                      </Stack>
                    );
                  }}
                />
                <Box>
                  <TextField
                    name="name"
                    variant="outlined"
                    size="small"
                    label="Meals per day"
                    defaultValue={2}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Stack spacing={1} width="100%" px={2}>
                  You need to give the dog some food:
                </Stack>
              </CardActions>
            </Card>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
