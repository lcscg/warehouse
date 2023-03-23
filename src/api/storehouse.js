import request from '@/utils/request'

export function getGoods(params) {
  return request({
    url: '/api/getGoods',
    method: 'get',
    params
  })
}

export function updateGoods(data) {
  return request({
    url: '/api/updateGoods',
    method: 'post',
    data
  })
}

export function delGoods(data) {
  return request({
    url: '/api/delGoods',
    method: 'post',
    data
  })
}

export function addGoods(data) {
  return request({
    url: '/api/addGoods',
    method: 'Post',
    data
  })
}

export function exportExcel() {
  return request({
    url: '/api/exportExcel',
    method: 'get',
  })
}