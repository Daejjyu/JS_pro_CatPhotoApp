import ImageView from './imageView.js'
import Breadcrumb from './breadcrumb.js'
import Nodes from './nodes.js'
import { request } from './api.js'
import Loading from './loading.js'

const cache = {}

export default function App($app) {
    this.state = {
        isRoot: false,
        nodes: [],
        depth: [],
        selectedFilePath: null,
        isLoading: false,
    }

    const loading = new Loading({
        $app,
        initialState: this.state.isLoading,
    })

    const imageView = new ImageView({
        $app,
        initialState: this.state.selectedFilePath,
        onClick: () => {
            this.setState({
                ...this.state,
                selectedFilePath: null,
            })
        }
    })

    const breadcrumb = new Breadcrumb({
        $app,
        initialState: this.state.depth,
        onClick: (index) => {
            if (index == null) {
                this.setState({
                    ...this.state,
                    depth: [],
                    nodes: cache.root,
                    isRoot: true
                })
                return
            }

            if (index == this.state.depth.length - 1) {
                return
            }

            const nextState = { ...this.state }
            const nextDepth = this.state.depth.slice(0, index + 1)

            this.setState({
                ...nextState,
                depth: nextDepth,
                nodes: cache[nextDepth[nextDepth.length - 1].id]
            })
        }
    })

    const nodes = new Nodes({
        $app,
        initialState: {
            isRoot: this.state.isRoot,
            nodes: this.state.nodes
        },
        onClick: async (node) => {
            try {
                if (node.type === 'DIRECTORY') {
                    if (cache[node.id]) {
                        this.setState({
                            ...this.state,
                            isRoot: false,
                            depth: [...this.state.depth, node],
                            nodes: cache[node.id]
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            isLoading: true
                        })
                        const nextNodes = await request(node.id)
                        this.setState({
                            ...this.state,
                            depth: [...this.state.depth, node],
                            isRoot: false,
                            nodes: nextNodes,
                            isLoading: false
                        })
                        cache[node.id] = nextNodes
                    }
                } else if (node.type === 'FILE') {
                    this.setState({
                        ...this.state,
                        selectedFilePath: node.filePath
                    })
                }
            } catch (e) {

            }
        },
        onBackClick: async () => {
            try {
                const nextState = { ...this.state }
                nextState.depth.pop()

                const prevNodeId = nextState.depth.length === 0 ? null : nextState.depth[nextState.depth.length - 1].id

                if (prevNodeId === null) {
                    // const rootNodes = await request()
                    this.setState({
                        ...nextState,
                        isRoot: true,
                        nodes: cache.root,
                    })
                } else {
                    // const prevNodes = await request(prevNodeId)
                    this.setState({
                        ...nextState,
                        isRoot: false,
                        nodes: cache[prevNodeId],
                    })
                }
            } catch (e) {

            }
        }


    })

    this.setState = (nextState) => {
        this.state = nextState
        breadcrumb.setState(this.state.depth)
        nodes.setState({
            isRoot: this.state.isRoot,
            nodes: this.state.nodes
        })
        imageView.setState(this.state.selectedFilePath)
        loading.setState(this.state.isLoading)
    }

    const init = async () => {
        this.setState({
            ...this.state,
            isLoading: true
        })
        try {
            const rootNodes = await request()
            this.setState({
                ...this.state,
                isLoading: false,
                isRoot: true,
                nodes: rootNodes,
            })
            cache.root = rootNodes
        } catch (e) {

        }
    }

    init()
}