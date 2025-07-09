# Directus Content MCP Server

The [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) is a standard for helping AI tools and
LLMs talk to applications and services like Directus.

The Directus Content MCP Server is an interface for Directus users to interact with their data in LLMs. Some good use
cases are:

- **Content Editors**: build custom pages, write blog posts, update content, organize assets and more inside your
  Directus project.
- **Data Analysts**: query collections, generate reports, analyze trends, and extract insights from your Directus data
  using natural language.

It intentionally limits destructive actions that would result in really bad outcomes like data loss from deleting fields
or deleting collections.

We plan to provide more tools for developers who are working with local / development Directus projects in future
releases and potentially as a separate package to help further prevent data loss.

## Installation

### Prerequisites

- An existing Directus project

If you don't have an existing Directus project, you can get started with a free trial on
[Directus Cloud](https://directus.cloud/register) at https://directus.cloud/register

OR

You can spin up a sample Directus instance locally with the following terminal command.

```
npx directus-template-cli@latest init
```

### Step 1. Get Directus Credentials

You can use email and password or generate a static token to connect the MCP to your Directus instance.

To get a static access token:

1. Login to your Directus instnace
2. Go to the User Directory and choose your own user profile
3. Scroll down to the Token field
4. Generate token and copy it
5. Save the user (do NOT forget to save because you’ll get an error that shows Invalid token!)

### Step 2. Configure the MCP in your AI Tool

#### Claude Desktop

1. Open [Claude Desktop](https://claude.ai/download) and navigate to Settings.

2. Under the Developer tab, click Edit Config to open the configuration file.

3. Add the following configuration:

   ```json
   {
   	"mcpServers": {
   		"directus": {
   			"command": "npx",
   			"args": ["@directus/content-mcp@latest"],
   			"env": {
   				"DIRECTUS_URL": "https://your-directus-url.com",
   				"DIRECTUS_TOKEN": "your-directus-token>"
   			}
   		}
   	}
   }
   ```

   or if you're using email and password

   ```json
   {
   	"mcpServers": {
   		"directus": {
   			"command": "npx",
   			"args": ["@directus/content-mcp@latest"],
   			"env": {
   				"DIRECTUS_URL": "https://your-directus-url.com",
   				"DIRECTUS_USER_EMAIL": "john@example.com",
   				"DIRECTUS_USER_PASSWORD": "your-password"
   			}
   		}
   	}
   }
   ```
   Make sure you replace the placeholder values with your URL and credentials.

4. Save the configuration file and restart Claude desktop.

5. From the new chat screen, you should see an icon appear with the Directus MCP server.

#### Cursor

1. Open [Cursor](https://docs.cursor.com/context/model-context-protocol) and create a .cursor directory in your project
   root if it doesn't exist.

2. Create a `.cursor/mcp.json` file if it doesn't exist and open it.

3. Add the following configuration:

   ```json
   {
   	"mcpServers": {
   		"directus": {
   			"command": "npx",
   			"args": ["@directus/content-mcp@latest"],
   			"env": {
   				"DIRECTUS_URL": "https://your-directus-url.com",
   				"DIRECTUS_TOKEN": "your-directus-token>"
   			}
   		}
   	}
   }
   ```

   or if you're using email and password

   ```json
   {
   	"mcpServers": {
   		"directus": {
   			"command": "npx",
   			"args": ["@directus/content-mcp@latest"],
   			"env": {
   				"DIRECTUS_URL": "https://your-directus-url.com",
   				"DIRECTUS_USER_EMAIL": "john@example.com",
   				"DIRECTUS_USER_PASSWORD": "your-password"
   			}
   		}
   	}
   }
   ```

   Make sure you replace the placeholder values with your URL and credentials.

4. Save the configuration file.

5. Open Cursor and navigate to Settings/MCP. You should see a green active status after the server is successfully
   connected.

## Tools

The MCP Server provides the following tools to interact with your Directus instance:

| Tool                 | Description                                          | Use Cases                                                      |
| -------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| **system-prompt**    | Provides context to the LLM assistant about its role | Start of a session to understand the system context            |
| **users-me**         | Get current user information                         | Understanding permissions, personalizing responses             |
| **read-collections** | Retrieve the schema of all collections               | Exploring database structure, understanding relationships      |
| **read-items**       | Fetch items from any collection                      | Retrieving content, searching for data, displaying information |
| **create-item**      | Create new items in collections                      | Adding new content, records, or entries                        |
| **update-item**      | Modify existing items                                | Editing content, updating statuses, correcting information     |
| **delete-item**      | Remove items from collections                        | Cleaning up outdated content                                   |
| **read-files**       | Access file metadata or raw content                  | Finding images, documents, or media assets                     |
| **import-file**      | Import files from URLs                               | Adding external media to your Directus instance                |
| **update-files**     | Update file metadata                                 | Organizing media, adding descriptions, tagging                 |
| **read-fields**      | Get field definitions for collections                | Understanding data structure, field types and validation       |
| **read-field**       | Get specific field information                       | Detailed field configuration                                   |
| **create-field**     | Add new fields to collections                        | Extending data models                                          |
| **update-field**     | Modify existing fields                               | Changing field configuration, interface options                |
| **read-flows**       | List available automation flows                      | Finding automation opportunities                               |
| **trigger-flow**     | Execute automation flows                             | Bulk operations, publishing, status changes                    |
| **read-comments**    | View comments on items                               | Retrieving feedback, viewing discussion threads                |
| **upsert-comment**   | Add or update comments                               | Providing feedback, documenting decisions                      |
| **markdown-tool**    | Convert between markdown and HTML                    | Content formatting for WYSIWYG fields                          |
| **get-prompts**      | List available prompts                               | Discovering pre-configured prompt templates                    |
| **get-prompt**       | Execute a stored prompt                              | Using prompt templates for consistent AI interactions          |

### System Prompt

The MCP server comes with a system prompt that helps encourage the right tool use and provides guiderails for the LLM.
You can overwrite the default system prompt in your env configuration by setting the `MCP_SYSTEM_PROMPT` variable.

You can also disable the system prompt entirely if desired.

Just set `MCP_SYSTEM_PROMPT_ENABLED` to `false`

### Prompt Configuration

The MCP server supports dynamic prompts stored in a Directus collection. Prompts are not widely supported across MCP
Clients, but Claude Desktop does have support for them.

You can configure the following:

- `DIRECTUS_PROMPTS_COLLECTION_ENABLED`: Set to "true" to enable prompt functionality
- `DIRECTUS_PROMPTS_COLLECTION`: The name of the collection containing prompts
- `DIRECTUS_PROMPTS_NAME_FIELD`: Field name for the prompt name (default: "name")
- `DIRECTUS_PROMPTS_DESCRIPTION_FIELD`: Field name for the prompt description (default: "description")
- `DIRECTUS_PROMPTS_SYSTEM_PROMPT_FIELD`: Field name for the system prompt text (default: "system_prompt")
- `DIRECTUS_PROMPTS_MESSAGES_FIELD`: Field name for the messages array (default: "messages")

### Mustache Templating

Both system prompts and message content support mustache templating using the `{{ variable_name }}` syntax:

1. Define variables in your prompts using double curly braces: `Hello, {{ name }}!`
2. When calling a prompt, provide values for the variables in the `arguments` parameter
3. The MCP server will automatically replace all variables with their provided values

## Local / Dev Installation

1. Clone the repo
2. `pnpm install && pnpm build` to build the server
3. Configure Claude Desktop or Cursor like above, but pointing it to the `dist` file instead:
4. Use `pnpm dev` to watch for changes and rebuild the server

```json
{
	"mcpServers": {
		"directus": {
			"command": "node",
			"args": ["/path/to/directus-mcp-server/dist/index.js"]
		}
	}
}
```

Sample Claude Desktop Config for local dev with full settings

```json
{
	"mcpServers": {
		"directus": {
			"command": "node",
			"args": [
				"/path/to/directus-mcp-server/dist/index.js"
			],
			"env": {
				"DIRECTUS_URL": "DIRECTUS_URL",
				"DIRECTUS_TOKEN": "DIRECTUS_TOKEN",
				"MCP_SYSTEM_PROMPT_ENABLED": "true",
				"MCP_SYSTEM_PROMPT": "You're a content editor working at Directus.\nYou're a master at copywriting and creating messaging that resonates with technical audiences.\nYou'll be given details about a Directus instance and the schema within it. You'll be asked to update content and other helpful tasks. **Rules** \n - If you're updating HTML / WYSWIG fields inside the CMS - DO NOT ADD extra styling, classes, or markup outside the standard HTML elements. If you're not 95% sure what values should go into a certain field, stop and ask the user. Before deleting anything, confirm with the user and prompt them for an explicit DELETE confirmation via text.",
				"DIRECTUS_PROMPTS_COLLECTION_ENABLED": "true",
				"DIRECTUS_PROMPTS_COLLECTION": "ai_prompts"
			}
		}
	}
}
```

### Example Configurations

#### Basic Configuration with Token

```json
{
	"mcpServers": {
		"directus": {
			"command": "npx",
			"args": ["@directus/content-mcp@latest"],
			"env": {
				"DIRECTUS_URL": "https://your-directus-instance.com",
				"DIRECTUS_TOKEN": "your_directus_token"
			}
		}
	}
}
```

#### Configuration with Email/Password Authentication

```json
{
	"mcpServers": {
		"directus": {
			"command": "npx",
			"args": ["@directus/content-mcp@latest"],
			"env": {
				"DIRECTUS_URL": "https://your-directus-instance.com",
				"DIRECTUS_USER_EMAIL": "user@example.com",
				"DIRECTUS_USER_PASSWORD": "your_password"
			}
		}
	}
}
```

#### Advanced Configuration with Custom System Prompt and Tool Restrictions

```json
{
	"mcpServers": {
		"directus": {
			"command": "npx",
			"args": ["@directus/content-mcp@latest"],
			"env": {
				"DIRECTUS_URL": "https://your-directus-instance.com",
				"DIRECTUS_TOKEN": "your_directus_token",
				"DISABLE_TOOLS": "[\"delete-item\", \"update-field\"]",
				"MCP_SYSTEM_PROMPT_ENABLED": "true",
				"MCP_SYSTEM_PROMPT": "You are an assistant specialized in managing content for our marketing website.",
				"DIRECTUS_PROMPTS_COLLECTION_ENABLED": "true",
				"DIRECTUS_PROMPTS_COLLECTION": "ai_prompts",
				"DIRECTUS_PROMPTS_NAME_FIELD": "name",
				"DIRECTUS_PROMPTS_DESCRIPTION_FIELD": "description",
				"DIRECTUS_PROMPTS_SYSTEM_PROMPT_FIELD": "system_prompt",
				"DIRECTUS_PROMPTS_MESSAGES_FIELD": "messages"
			}
		}
	}
}
```

# ❤️ Contributing

We love to see community contributions, but please open an issue first to discuss proposed changes before submitting any
PRs.

## 🙏 Thanks To

This started as an experiment by the dude, the legend, the [@rijkvanzanten](https://github.com/rijkvanzanten) 🙌

## License

MIT
