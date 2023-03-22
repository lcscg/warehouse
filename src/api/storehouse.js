import request from '@/utils/request'

export function getOwner(params) {
  return request({
    url: '/api/getOwner',
    method: 'get',
    params
  })
}

export function getGenre(params) {
  return request({
    url: '/api/getGenre',
    method: 'get',
    params
  })
}

export function getGoods(params) {
  return request({
    url: '/api/getGoods',
    method: 'get',
    params
  })
}

export function updateGoods(params) {
  return request({
    url: '/api/updateGoods',
    method: 'post',
    params
  })
}

export function delGoods(params) {
  return request({
    url: '/api/delGoods',
    method: 'post',
    params
  })
}