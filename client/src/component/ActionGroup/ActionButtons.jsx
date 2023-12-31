import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default ({ funcBtn, custBtn }) => (
  <React.Fragment>
    {funcBtn.map(btn => (
      <Tooltip key={btn.title} title={btn.title} placement="top">
        <IconButton
          onClick={() => btn.func(btn)}
          color={btn.isActive ? 'primary' : 'default'}
        >
          {btn.Icon}
        </IconButton>
      </Tooltip>
    ))}
    <div style={{ float: 'right' }}>
      {custBtn.map(btn => (
        <Tooltip key={btn.title} title={btn.title}>
          <IconButton onClick={() => btn.func(btn)}>{btn.Icon}</IconButton>
        </Tooltip>
      ))}
    </div>
  </React.Fragment>
);
