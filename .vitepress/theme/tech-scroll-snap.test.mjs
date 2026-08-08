import assert from 'node:assert/strict'
import test from 'node:test'
import { getTechFocus, getTechSnapProgress } from './tech-scroll-snap.mjs'

test('技术栏滚动停止后吸附到最近的双卡片组', () => {
  for (const progress of [0.46, 0.53, 0.68, 0.78]) {
    const snappedProgress = getTechSnapProgress(progress, 5)
    const snappedFocus = getTechFocus(snappedProgress, 5)
    assert.ok(Math.abs(snappedFocus - Math.round(snappedFocus)) < 1e-6)
  }
})

test('技术栏吸附不处理动画区间之外的滚动', () => {
  assert.equal(getTechSnapProgress(0.44, 5), null)
  assert.equal(getTechSnapProgress(0.8, 5), null)
})
