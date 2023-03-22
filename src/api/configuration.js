import request from '@/utils/request'

export function getConfiguration(params) {
  return request({
    url: '/api/getConfiguration',
    method: 'get',
    params
  })
}

export function updateConfiguration(data) {
  return request({
    url: '/api/updateConfiguration',
    method: 'post',
    data
  })
}
