import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import Composer from './Composer'

import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<Composer />, document.getElementById('root'))
registerServiceWorker()
