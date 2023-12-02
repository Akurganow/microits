import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
	if (res.socket.server.io) {
		console.log('Socket is already running')
	} else {
		console.log('Socket is initializing')
		res.socket.server.io = new Server(res.socket.server)
	}
	res.end()
}

export default SocketHandler