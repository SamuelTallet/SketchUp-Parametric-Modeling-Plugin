import { t } from '../../i18n/translate'
import { BaseNode } from './BaseNode'

const POINT_OUTPUTS: [key: string, label: string][] = [
  ['front_bottom_left', 'Front bottom left'],
  ['front_bottom_center', 'Front bottom center'],
  ['front_bottom_right', 'Front bottom right'],
  ['front_center', 'Front center'],
  ['front_top_left', 'Front top left'],
  ['front_top_center', 'Front top center'],
  ['front_top_right', 'Front top right'],
  ['bottom_center', 'Bottom center'],
  ['left_bottom_center', 'Left bottom center'],
  ['left_center', 'Left center'],
  ['left_top_center', 'Left top center'],
  ['center', 'Center'],
  ['right_bottom_center', 'Right bottom center'],
  ['right_center', 'Right center'],
  ['right_top_center', 'Right top center'],
  ['top_center', 'Top center'],
  ['back_bottom_left', 'Back bottom left'],
  ['back_bottom_center', 'Back bottom center'],
  ['back_bottom_right', 'Back bottom right'],
  ['back_center', 'Back center'],
  ['back_top_left', 'Back top left'],
  ['back_top_center', 'Back top center'],
  ['back_top_right', 'Back top right'],
]

export class GetPointsNode extends BaseNode {
  constructor() {
    super('Get points')
    this.addSocketInput('groups', t('Group'), 'groups')
    this.addSocketOutput('groups', t('Group'), 'groups')

    for (const [key, label] of POINT_OUTPUTS) {
      this.addSocketOutput(key, t(label), 'point')
    }
  }
}
