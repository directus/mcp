import { z } from 'zod';
import {
	nullableNumber,
	nullableRecord,
	nullableString,
	optionalBoolean,
	optionalNumber,
	optionalString,
} from './common.js';

export const FieldSchemaInfoSchema = z.object({
	name: optionalString().describe('The name of the field (often inferred).'),
	table: optionalString().describe('The collection of the field (often inferred).'),
	data_type: optionalString().describe('Database specific data type for the field.'),
	default_value: z.any().nullable().optional().describe('The default value of the field.'),
	max_length: nullableNumber().describe('The max length of the field.'),
	is_nullable: optionalBoolean().describe('If the field is nullable.'),
	is_primary_key: optionalBoolean().describe('If the field is primary key.'),
	has_auto_increment: optionalBoolean().describe('If the field has auto increment.'),
	foreign_key_table: nullableString().describe('Related table from the foreign key constraint.'),
	foreign_key_column: nullableString().describe('Related column from the foreign key constraint.'),
	comment: nullableString().describe('Comment as saved in the database.'),
}).partial().describe('Database level schema information for a field (subset for creation/update).');

export const FieldMetaSchema = z.object({
	collection: optionalString().describe('Collection name (often inferred).'),
	field: optionalString().describe('Field name (often inferred).'),
	interface: nullableString().describe('What interface is used.'),
	options: nullableRecord().describe('Options for the interface.'),
	display: nullableString().describe('What display is used.'),
	display_options: nullableRecord().describe('Options for the display.'),
	readonly: optionalBoolean().describe('If the field is read-only.'),
	hidden: optionalBoolean().describe('If the field should be hidden.'),
	sort: nullableNumber().describe('Sort order.'),
	width: optionalString().describe("Width of the field. Can be 'half', 'half-left', 'half-right', 'full', or 'fill'."),
	translations: nullableRecord().describe("Translations for the field's name."),
	note: nullableString().describe('A note for the field.'),
	required: optionalBoolean().describe('If the field is required.'),
	group: nullableString().describe('Field group (references another field name).'),
	validation: nullableRecord().describe('Validation rule object.'),
	validation_message: nullableString().describe('Validation error message.'),
	conditions: z.array(z.record(z.string(), z.any())).describe('Conditions to display the field.').nullable().optional(),
}).partial().describe('Directus specific metadata and configuration for a field (subset for creation/update).');

export const CreateFieldDataSchema = z.object({
	field: z.string().describe('Unique name of the field. Required.'),
	type: z.string().describe('Directus specific data type. Required.'),
	schema: FieldSchemaInfoSchema.optional().describe('Optional: Database schema details.'),
	meta: FieldMetaSchema.optional().describe('Optional: Directus metadata and configuration.'),
}).describe('Data payload for creating a new field.');

export const UpdateFieldDataSchema = z.object({
	type: optionalString().describe('Optional: New Directus data type.'),
	schema: FieldSchemaInfoSchema.optional().describe('Optional: Database schema details to update.'),
	meta: FieldMetaSchema.optional().describe('Optional: Directus metadata and configuration to update.'),
}).describe('Data payload for updating an existing field. All properties are optional.');

export const FieldSchema = z.object({
	collection: z.string(),
	field: z.string(),
	type: nullableString().describe('Directus data type of the field.'),
	schema: FieldSchemaInfoSchema.nullable(),
	meta: FieldMetaSchema.extend({
		id: optionalNumber().describe('Internal ID of the meta entry.'),
		interface: nullableString().describe('Interface used in Directus UI.'),
		display: nullableString().describe('Display used in Directus UI.'),
		readonly: optionalBoolean().describe('Whether the field is read-only.'),
		hidden: optionalBoolean().describe('Whether the field is hidden.'),
		sort: nullableNumber().describe('Sort order in the UI.'),
		width: optionalString().describe("UI width. Can be 'half', 'half-left', 'half-right', 'full', or 'fill'."),
	}).nullable().describe('Field metadata from Directus.'),
}).describe('Represents a Directus Field as typically returned by the API.');

export type DirectusField = z.infer<typeof FieldSchema>;
export type DirectusCreateFieldData = z.infer<typeof CreateFieldDataSchema>;
export type DirectusUpdateFieldData = z.infer<typeof UpdateFieldDataSchema>;
