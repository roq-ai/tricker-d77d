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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPhotoById, updatePhotoById } from 'apiSdk/photos';
import { Error } from 'components/error';
import { photoValidationSchema } from 'validationSchema/photos';
import { PhotoInterface } from 'interfaces/photo';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function PhotoEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PhotoInterface>(
    () => (id ? `/photos/${id}` : null),
    () => getPhotoById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PhotoInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePhotoById(id, values);
      mutate(updated);
      resetForm();
      router.push('/photos');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PhotoInterface>({
    initialValues: data,
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
            Edit Photo
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(PhotoEditPage);
