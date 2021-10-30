'use strict'

const { MeiliSearch } = require('meilisearch')

/**
 * meilisearch.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
  apiKey: '',
});

function removeDateLogs(document) {
  const {
    updated_at: omitUpdatedAt,
    created_at: omitCreatedAt,
    created_by: omitCreatedBy,
    updated_by: omitUpdatedBy,
    published_at: omitPublishedAt,
    ...noDateLogDocument
  } = document
  return noDateLogDocument
}

async function addDocuments({ indexUid, data }) {
  const noDateLogDocuments = data.map(document => removeDateLogs(document))
  return client.index(indexUid).addDocuments(noDateLogDocuments)
}

async function deleteDocuments({ indexUid, documentIds }) {
  return client.index(indexUid).deleteDocuments(documentIds)
}

async function deleteAllDocuments({ indexUid }) {
  return client.index(indexUid).deleteAllDocuments()
}

async function getIndexes() {
  return client.listIndexes()
}

async function createIndex({ indexUid }) {
  return client.getOrCreateIndex(indexUid)
}

async function getRawIndex({ indexUid }) {
  return client.index(indexUid).getRawInfo()
}

async function waitForPendingUpdates({ indexUid, updateNbr }) {
  const updates = (await client.index(indexUid).getAllUpdateStatus())
    .filter(update => update.status === 'enqueued')
    .slice(0, updateNbr)
  let documentsAdded = 0
  for (const update of updates) {
    const { updateId } = update
    const task = await waitForPendingUpdate.call(this, { updateId, indexUid })
    const {
      type: { number },
    } = task
    documentsAdded += number
  }
  return documentsAdded
}

async function waitForPendingUpdate({ updateId, indexUid }) {
  return client
    .index(indexUid)
    .waitForPendingUpdate(updateId, { intervalMs: 500 })
}

async function deleteIndex({ indexUid }) {
  return client.deleteIndex(indexUid)
}

async function deleteIndexes() {
  const indexes = await getIndexes()
  const deletePromise = indexes.map(index =>
    deleteIndex({ indexUid: index.uid })
  )
  return Promise.all(deletePromise)
}

async function getStats({ indexUid }) {
  return client.index(indexUid).getStats()
}

module.exports = {
  addDocuments,
  getIndexes,
  waitForPendingUpdate,
  deleteIndexes,
  deleteIndex,
  deleteDocuments,
  getRawIndex,
  deleteAllDocuments,
  createIndex,
  waitForPendingUpdates,
  getStats,
}
