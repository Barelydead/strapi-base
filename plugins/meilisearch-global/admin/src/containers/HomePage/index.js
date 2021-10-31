/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react'
import { Header } from '@buffetjs/custom'
import { Button, Table } from '@buffetjs/core'
import { request } from 'strapi-helper-plugin';
import pluginId from '../../pluginId'


const HomePage = () => {
  const [ nrOfDocs, setNrOfDocs ] = useState(0);

  const getStats = async () => {
    const res = await request(`/${pluginId}/getStats`, {
      method: 'GET',
    })

    setNrOfDocs(res.numberOfDocuments);
  }

  const addDocuments = async () => {
    await request(`/${pluginId}/addDocuments`, {
      method: 'GET',
    })

    strapi.notification.toggle({
      type: 'success',
      message: 'Added documents to index',
      timeout: 4000,
    })

    await getStats();
  }

  const clearDocuments = async () => {
    await request(`/${pluginId}/clearDocuments`, {
      method: 'GET',
    })

    strapi.notification.toggle({
      type: 'success',
      message: 'Global index cleared',
      timeout: 4000,
    })

    await getStats();
  }

  const headers = [
    {
      name: 'Index',
      value: 'index',
    },
    {
      name: 'In meilisearch',
      value: 'inMeilisearch',
    },
    {
      name: 'Items indexed',
      value: 'itemsIndexed',
    },
  ];

  const rows = [
    {
      index: 'global',
      inMeilisearch: 'Yes',
      itemsIndexed: `${nrOfDocs}`,
    },
  ]

  return (
    <div className="container-fluid" style={{ padding: '18px 30px 66px 30px' }}>
      <Header
        title={{
          label: 'Meilisearch Global',
        }}
        content="Some description"
      />
      <Button color="success" onClick={() => addDocuments()}>Update index</Button>
      <Button color="delete" onClick={() => clearDocuments()}>Clear index</Button>
      <div style={{ marginTop: '20px' }}>
        <Table headers={headers} rows={rows} />
      </div>
      
    </div>
  )
}

export default memo(HomePage)
