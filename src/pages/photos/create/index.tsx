import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPhoto } from 'apiSdk/photos';
import { Error } from 'components/error';
import { photoValidationSchema } from 'validationSchema/photos';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PhotoInterface } from 'interfaces/photo';

function PhotoCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PhotoInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPhoto(values);
      resetForm();
      router.push('/photos');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PhotoInterface>({
    initialValues: {
      original_photo: '',
      enhanced_photo: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: photoValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Photo
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="original_photo" mb="4" isInvalid={!!formik.errors?.original_photo}>
            <FormLabel>Original Photo</FormLabel>
            <Input
              type="text"
              name="original_photo"
              value={formik.values?.original_photo}
              onChange={formik.handleChange}
            />
            {formik.errors.original_photo && <FormErrorMessage>{formik.errors?.original_photo}</FormErrorMessage>}
          </FormControl>
          <FormControl id="enhanced_photo" mb="4" isInvalid={!!formik.errors?.enhanced_photo}>
            <FormLabel>Enhanced Photo</FormLabel>
            <Input
              type="text"
              name="enhanced_photo"
              value={formik.values?.enhanced_photo}
              onChange={formik.handleChange}
            />
            {formik.errors.enhanced_photo && <FormErrorMessage>{formik.errors?.enhanced_photo}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'photo',
    operation: AccessOperationEnum.CREATE,
  }),
)(PhotoCreatePage);
