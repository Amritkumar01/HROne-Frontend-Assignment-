import { JsonSchemaBuilder } from './components/JsonSchemaBuilder'

function App() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8">JSON Schema Builder</h1>
      <JsonSchemaBuilder />
    </div>
  )
}

export default App