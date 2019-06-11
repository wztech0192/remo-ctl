export default theme => ({
  container: {
    height: 'calc(100% - 50px)'
  },
  mouseControl: {
    height: 'calc(100% - 30px)'
  },
  keyboard: {
    height: 30,
    width: '100%',
    textAlign: 'center'
  },

  mouseclick: {
    height: '50%',
    overflow: 'hidden'
  },
  mcbtn: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 10px 0px lightgray',
    userSelect: 'none'
  },

  mousemove: {
    boxShadow: 'inset 0 0 30px 0px lightgray',
    overflow: 'hidden'
  },

  mousescroll: {
    boxShadow: 'inset -2px 0 20px 2px lightgray',
    borderRadius: '25px 0 0 25px'
  },
  moveball: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '100%',
    boxShadow: 'inset 0 0 10px 0 black',
    display: 'none'
  },
  staticball: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '100%',
    boxShadow: ' 0 0 30px 0 black',
    display: 'none'
  }
});
