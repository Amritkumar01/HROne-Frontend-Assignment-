import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { X, Plus, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export type FieldType = "string" | "number" | "boolean" | "float" | "objectId" | "nested"

export interface SchemaField {
    id: string
    name: string
    type: FieldType
    required: boolean
    children?: SchemaField[]
}

interface FormData {
    fields: SchemaField[]
}

// Simple UI Components
const Button = ({ className, variant = 'default', size = 'default', children, ...props }: {
    className?: string;
    variant?: 'default' | 'ghost';
    size?: 'default' | 'sm';
    children: React.ReactNode;
    [key: string]: any;
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50'
    const variants: { [key in 'default' | 'ghost']: string } = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost: 'hover:bg-gray-100',
    }
    const sizes: { [key in 'default' | 'sm']: string } = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
    }
    return (
        <button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
            {children}
        </button>
    )
}

const Input = ({ className, ...props }: any) => (
    <input
        className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
            className
        )}
        {...props}
    />
)

const Switch = ({ checked, onCheckedChange, className }: any) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
            'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
            checked ? 'bg-blue-600' : 'bg-gray-200',
            className
        )}
        onClick={() => onCheckedChange(!checked)}
    >
        <span
            className={cn(
                'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                checked ? 'translate-x-5' : 'translate-x-0'
            )}
        />
    </button>
)

const Select = ({ value, onValueChange, children }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative">
            <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-white shadow-md">
                    <div className="p-1">
                        {React.Children.map(children, (child) =>
                            React.cloneElement(child, { onValueChange, setIsOpen })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const SelectItem = ({ value, children, onValueChange, setIsOpen }: any) => (
    <div
        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
        onClick={() => {
            onValueChange(value)
            setIsOpen(false)
        }}
    >
        {children}
    </div>
)

const Card = ({ className, children, ...props }: any) => (
    <div className={cn('rounded-lg border bg-white shadow-sm', className)} {...props}>
        {children}
    </div>
)

const CardHeader = ({ className, children, ...props }: any) => (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
        {children}
    </div>
)

const CardTitle = ({ className, children, ...props }: any) => (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props}>
        {children}
    </h3>
)

const CardContent = ({ className, children, ...props }: any) => (
    <div className={cn('p-6 pt-0', className)} {...props}>
        {children}
    </div>
)

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9)

const getDefaultValue = (type: FieldType): any => {
    switch (type) {
        case "string": return "STRING"
        case "number": return "number"
        case "boolean": return "boolean"
        case "float": return "float"
        case "objectId": return "objectId"
        case "nested": return {}
        default: return ""
    }
}

const buildJsonFromFields = (fields: SchemaField[]): Record<string, any> => {
    const result: Record<string, any> = {}
    fields.forEach((field) => {
        if (field.name.trim()) {
            if (field.type === "nested" && field.children) {
                result[field.name] = buildJsonFromFields(field.children)
            } else {
                result[field.name] = getDefaultValue(field.type)
            }
        }
    })
    return result
}

// Field Row Components
// Recursive update and remove helpers
function updateFieldById(fields: SchemaField[], id: string, updater: (field: SchemaField) => SchemaField): SchemaField[] {
    return fields.map(field => {
        if (field.id === id) {
            return updater(field)
        } else if (field.type === 'nested' && field.children) {
            return {
                ...field,
                children: updateFieldById(field.children, id, updater)
            }
        } else {
            return field
        }
    })
}

function removeFieldById(fields: SchemaField[], id: string): SchemaField[] {
    return fields
        .filter(field => field.id !== id)
        .map(field =>
            field.type === 'nested' && field.children
                ? { ...field, children: removeFieldById(field.children, id) }
                : field
        )
}

const FieldRow = ({ field, onFieldChange, onFieldRemove, nestingLevel = 0 }: {
    field: SchemaField,
    onFieldChange: (id: string, key: keyof SchemaField, value: any) => void,
    onFieldRemove: (id: string) => void,
    nestingLevel?: number
}) => {
    const handleFieldChange = (key: keyof SchemaField, value: any) => {
        onFieldChange(field.id, key, value)
    }

    const handleTypeChange = (newType: FieldType) => {
        if (newType === 'nested') {
            handleFieldChange('type', newType)
            if (!field.children) {
                handleFieldChange('children', [])
            }
        } else {
            handleFieldChange('type', newType)
            if (field.children) {
                handleFieldChange('children', undefined)
            }
        }
    }

    return (
        <div className={cn('space-y-2', nestingLevel > 0 && 'ml-6 border-l-2 border-gray-200 pl-4')}>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Input
                    placeholder="Field name"
                    value={field.name}
                    onChange={(e: any) => handleFieldChange('name', e.target.value)}
                    className="flex-1"
                />
                <Select value={field.type} onValueChange={handleTypeChange}>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                    <SelectItem value="float">float</SelectItem>
                    <SelectItem value="objectId">objectId</SelectItem>
                    <SelectItem value="nested">nested</SelectItem>
                </Select>
                <Switch
                    checked={field.required}
                    onCheckedChange={(checked: boolean) => handleFieldChange('required', checked)}
                />
                <Button variant="ghost" size="sm" onClick={() => onFieldRemove(field.id)} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                </Button>
            </div>
            {field.type === 'nested' && field.children && (
                <div className="space-y-2">
                    {field.children.map((childField, childIndex) => (
                        <FieldRow
                            key={childField.id}
                            field={childField}
                            onFieldChange={onFieldChange}
                            onFieldRemove={onFieldRemove}
                            nestingLevel={nestingLevel + 1}
                        />
                    ))}
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full text-xs py-1"
                        onClick={() => {
                            const newChild: SchemaField = {
                                id: generateId(),
                                name: '',
                                type: 'string',
                                required: false,
                            }
                            // Add new child to children array
                            onFieldChange(field.id, 'children', [...(field.children || []), newChild])
                        }}
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                    </Button>
                </div>
            )}
        </div>
    )
}

// Main Component
export const JsonSchemaBuilder = () => {
    const { control, watch, setValue } = useForm<FormData>({
        defaultValues: {
            fields: [
                {
                    id: generateId(),
                    name: 'name',
                    type: 'string',
                    required: false,
                },
            ],
        },
    })
    const { fields, append } = useFieldArray({
        control,
        name: 'fields',
    })
    const watchedFields = watch('fields')
    const [jsonOutput, setJsonOutput] = useState<Record<string, any>>({})
    useEffect(() => {
        const json = buildJsonFromFields(watchedFields)
        setJsonOutput(json)
    }, [watchedFields])
    // Handler to update any field (including nested)
    const handleFieldChange = (id: string, key: keyof SchemaField, value: any) => {
        const updated = updateFieldById(watchedFields, id, (field) => ({ ...field, [key]: value }))
        setValue('fields', updated)
    }
    // Handler to remove any field (including nested)
    const handleFieldRemove = (id: string) => {
        const updated = removeFieldById(watchedFields, id)
        setValue('fields', updated)
    }
    const addField = () => {
        append({
            id: generateId(),
            name: '',
            type: 'string',
            required: false,
        })
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Schema Builder</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {watchedFields.map((field, index) => (
                            <FieldRow
                                key={field.id}
                                field={field}
                                onFieldChange={handleFieldChange}
                                onFieldRemove={handleFieldRemove}
                            />
                        ))}
                        <Button variant="default" className="w-full" onClick={addField}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>JSON Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                        {JSON.stringify(jsonOutput, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}