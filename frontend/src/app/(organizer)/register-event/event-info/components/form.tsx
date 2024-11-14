'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'

import { z } from 'zod'
import { RegisterEventPage } from '.'
import { RegisterEventSchema } from '../../../../../../schemas'

export const FormDataSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    country: z.string().min(1, 'Country is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip is required')
})
type Inputs = z.infer<typeof FormDataSchema>

const steps = [
    {
        id: 'Step 1',
        name: 'Personal Information',
        fields: ['firstName', 'lastName', 'email']
    },
    {
        id: 'Step 2',
        name: 'Address',
        fields: ['country', 'state', 'city', 'street', 'zip']
    },
    { id: 'Step 3', name: 'Complete' }
]


export default function Form() {
    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors }
    } = useForm<Inputs>({
        resolver: zodResolver(RegisterEventSchema)
    })

    const processForm: SubmitHandler<Inputs> = data => {
        console.log(data)
        reset()
    }

    type FieldName = keyof Inputs

    const next = async () => {
        const fields = steps[currentStep].fields
        const output = await trigger(fields as FieldName[], { shouldFocus: true })

        if (!output) return

        if (currentStep < steps.length - 1) {
            if (currentStep === steps.length - 2) {
                await handleSubmit(processForm)()
            }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
        }
    }

    return (
        <section className='absolute inset-0 flex flex-col justify-between p-24'>
            {/* steps */}
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                    {steps.map((step, index) => (
                        <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <span className='text-sm font-medium text-sky-600 transition-colors '>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            ) : currentStep === index ? (
                                <div
                                    className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                    aria-current='step'
                                >
                                    <span className='text-sm font-medium text-sky-600'>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            ) : (
                                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Form */}
            <form className='mt-12 py-12' onSubmit={handleSubmit(processForm)}>
                {currentStep === 0 && (
                    <>
                        <h2 className='text-base font-semibold leading-7 text-gray-900'>
                            Personal Information
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>
                            Provide your personal details.
                        </p>
                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                            <div className='sm:col-span-3'>
                                <label
                                    htmlFor='firstName'
                                    className='block text-sm font-medium leading-6 text-gray-900'
                                >
                                    First name
                                </label>
                                <div className='mt-2'>
                                    <input
                                        type='text'
                                        id='firstName'
                                        {...register('firstName')}
                                        autoComplete='given-name'
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                                    />
                                    {errors.firstName?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className='sm:col-span-3'>
                                <label
                                    htmlFor='lastName'
                                    className='block text-sm font-medium leading-6 text-gray-900'
                                >
                                    Last name
                                </label>
                                <div className='mt-2'>
                                    <input
                                        type='text'
                                        id='lastName'
                                        {...register('lastName')}
                                        autoComplete='family-name'
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                                    />
                                    {errors.lastName?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className='sm:col-span-4'>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium leading-6 text-gray-900'
                                >
                                    Email address
                                </label>
                                <div className='mt-2'>
                                    <input
                                        id='email'
                                        type='email'
                                        {...register('email')}
                                        autoComplete='email'
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                                    />
                                    {errors.email?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <h2 className='text-base font-semibold leading-7 text-gray-900'>
                            Address
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>
                            Address where you can receive mail.
                        </p>

                        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                            <div className='sm:col-span-3'>
                                <label
                                    htmlFor='country'
                                    className='block text-sm font-medium leading-6 text-gray-900'
                                >
                                    Country
                                </label>
                                <div className='mt-2'>
                                    <select
                                        id='country'
                                        {...register('country')}
                                        autoComplete='country-name'
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6'
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                    {errors.country?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.country.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className='col-span-full'>
                                <label
                                    htmlFor='street'
                                    className='block text-sm font-medium leading-6 text-gray-900'
                                >
                                    Street address
                                </label>
                                <div className='mt-2'>
                                    <input
                                        type='text'
                                        id='street'
                                        {...register('street')}
                                        autoComplete='street-address'
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                                    />
                                    {errors.street?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.street.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Navigation Buttons */}
                <div className='mt-6 flex items-center justify-between'>
                    <button type='button' onClick={prev} className='text-gray-500'>
                        Back
                    </button>
                    <button type='button' onClick={next} className='text-sky-600'>
                        {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </div>
            </form>
        </section>
    )
}
