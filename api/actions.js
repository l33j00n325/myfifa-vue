import http from './http'
import { routes } from './routes'

function parentId (parent) {
  return parent ? `${parent}Id` : ''
}

function dataId ({ recordId, dataName }) {
  return recordId || `${dataName}Id`
}

export function fetch ({ model, parent }) {
  const $parentId = parentId(parent)
  return ({ rootState }, pathData) => http({
    path: routes[model.entity].index,
    pathData: { [$parentId]: pathData[$parentId] },
    token: rootState.token,
    success ({ data }) {
      model.insert({ data })
    }
  })
}

export function get ({ model, recordId, dataName }) {
  const $id = dataId({ recordId, dataName })
  return ({ rootState }, pathData) => http({
    path: routes[model.entity].record,
    pathData: { [$id]: pathData[$id] },
    token: rootState.token,
    success ({ data }) {
      model.insert({ data })
    }
  })
}

export function create ({ model, parent, dataName }) {
  const $parentId = parentId(parent)
  return ({ commit, rootState }, data) => http({
    method: 'post',
    path: routes[model.entity].index,
    pathData: { [$parentId]: data[$parentId] },
    token: rootState.token,
    data: { [dataName]: data[dataName] },
    success ({ data }) {
      model.insert({ data })

      commit('broadcaster/ANNOUNCE', {
        message: `${model.title} has been added.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export function update ({ model, recordId, dataName }) {
  const $id = dataId({ recordId, dataName })
  return ({ commit, rootState }, data) => http({
    method: 'patch',
    path: routes[model.entity].record,
    pathData: { [$id]: data.id },
    token: rootState.token,
    data: { [dataName]: data },
    success ({ data }) {
      model.insert({ data })

      commit('broadcaster/ANNOUNCE', {
        message: `${model.title} has been updated.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export function remove ({ model, recordId, dataName }) {
  const $id = dataId({ recordId, dataName })
  return ({ commit, rootState }, id) => http({
    method: 'delete',
    path: routes[model.entity].record,
    pathData: { [$id]: id },
    token: rootState.token,
    success ({ data }) {
      model.delete(data.id)

      commit('broadcaster/ANNOUNCE', {
        message: `${model.title} has been removed.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export const crud = ({ model, parent, recordId, dataName }) => ({
  FETCH: fetch({ model, parent }),
  GET: get({ model, recordId, dataName }),
  CREATE: create({ model, parent, dataName }),
  UPDATE: update({ model, recordId, dataName }),
  REMOVE: remove({ model, recordId, dataName })
})
