import request from '@/utils/request'

export function getOwner(params) {
  return request({
    url: '/api/getOwner',
    method: 'get',
    params
  })
}
