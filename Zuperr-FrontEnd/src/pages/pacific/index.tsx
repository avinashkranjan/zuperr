import React, { useState } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Slider } from '@components/ui/slider' // Single Slider import
import { X } from 'lucide-react'
import { Card, CardHeader } from '@components/ui/card'

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [1, 2]
  const progressPercent = (currentStep / steps.length) * 100

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">Find right candidate for you</h1>
      <div className="w-full bg-gray-200 h-1 rounded-full">
        <div
          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

export default function CandidateSteps() {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 2 States
  const [rangeValue, setRangeValue] = useState<number[]>([50]) // 50 km default
  const [experience, setExperience] = useState('')
  const [degree, setDegree] = useState<string | null>(null)
  const [activeInLast, setActiveInLast] = useState<string | null>('15 Days')

  // Step 1 States
  const [jobTitle, setJobTitle] = useState('')
  const [skills, setSkills] = useState<string[]>([
    'Figma',
    'Adobe XD',
    'Zepline',
    'Protopie',
    'Sketch',
    'Canva',
  ])
  const [jobLocation, setJobLocation] = useState('')

  // Predefined degree options
  const degreeOptions = [
    'Below 10th',
    '10th',
    '12th',
    'Graduate',
    'Post Graduate',
    'PHD',
  ]

  // Predefined "Active in Last" options
  const activeOptions = ['15 Days', '30 Days', '60 Days', '90 Days']

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleNext = () => setCurrentStep((prev) => prev + 1)
  const handlePrevious = () => setCurrentStep((prev) => prev - 1)

  const renderStepTwo = () => (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
                    Setup Range (Upto 80 km)
        </label>
        <div className="flex items-center gap-3">
          {/* Single Slider component from shadcn/ui */}
          <Slider
            defaultValue={[rangeValue[0]]}
            max={80}
            step={1}
            className="w-1/2"
            onValueChange={(val) => {
              // val is an array of numbers
              setRangeValue(val)
            }}
          />
          <span className="text-gray-600">{rangeValue[0]}km</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Experience</label>
        <Input
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Degree</label>
        <div className="flex flex-wrap gap-2">
          {degreeOptions.map((deg) => (
            <Button
              key={deg}
              variant={degree === deg ? 'default' : 'outline'}
              onClick={() => setDegree(deg === degree ? null : deg)}
              className="text-sm"
            >
              {deg}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Active in Last</label>
        <Select
          value={activeInLast || undefined}
          onValueChange={(val) => setActiveInLast(val)}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {activeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div className="flex items-center justify-between">

        <Button variant="outline" onClick={handlePrevious}>
                    Back
        </Button>
        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded-full"
        >
                    Search Pacific Candidates
        </Button>
      </div>
    </div>
  )

  const renderStepOne = () => (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <Input
          placeholder="Job title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Skill&apos;s</label>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              <span className="mr-2">{skill}</span>
              <button type="button" onClick={() => removeSkill(skill)}>
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Job Location</label>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Job Location"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />
          <Button variant="outline" className="whitespace-nowrap">
                        Use my current location
          </Button>
        </div>
      </div>


      <Button className="bg-blue-600 text-white px-6 py-2 rounded-full"
        onClick={handleNext}

      >
                NEXT
      </Button>

    </div>
  )

  return (
    <Card className="max-w-3xl mx-auto p-4">
      <CardHeader>

        <StepIndicator currentStep={currentStep} />
      </CardHeader>
      {currentStep === 1 && renderStepOne()}
      {currentStep === 2 && renderStepTwo()}
    </Card>
  )
}
