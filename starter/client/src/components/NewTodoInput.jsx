import { useAuth0 } from '@auth0/auth0-react'
import dateFormat from 'dateformat'
import React, { useState } from 'react'
import { Divider, Grid, Input } from 'semantic-ui-react'
import { createTodo } from '../api/todos-api'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

export function NewTodoInput({ onNewTodo }) {
  const [newTodoName, setNewTodoName] = useState('')

  const { getAccessTokenSilently } = useAuth0()

  const onTodoCreate = async (event) => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: 'write:todos'
      })
      const dueDate = calculateDueDate()
      const createdTodo = await createTodo(accessToken, {
        name: newTodoName,
        dueDate
      })
      console.log('DKTEST====================================DKTEST')
      console.log(JSON.stringify(createdTodo))
      console.log("DKTEST DONE = " + createdTodo.done)
      console.log('DKTEST====================================DKTEST')
      onNewTodo(createdTodo)
    } catch (e) {
      console.log('Failed to created a new TODO', e)
      alert('Todo creation failed')
    }
  }

  return (
    <Grid.Row>
      <Grid.Column width={16}>
        <Input
          action={{
            color: 'teal',
            labelPosition: 'left',
            icon: 'add',
            content: 'New task',
            onClick: onTodoCreate
          }}
          fluid
          actionPosition="left"
          placeholder="To change the world..."
          onChange={(event) => setNewTodoName(event.target.value)}
        />
      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
  )
}

function calculateDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)

  return dateFormat(date, 'yyyy-mm-dd')
}
