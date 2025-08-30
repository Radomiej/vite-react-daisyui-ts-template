import dagre from '@dagrejs/dagre';
import { hierarchy, tree } from 'd3-hierarchy';
import { forceLink, forceManyBody, forceSimulation } from 'd3-force';
import ELK from 'elkjs/lib/elk.bundled.js';
import { Position } from 'reactflow';
import type { Edge, Node } from 'reactflow';
import type { HierarchyNode } from 'd3-hierarchy';
import type { SimulationNodeDatum } from 'd3-force';
import type { ElkNode, ElkExtendedEdge } from 'elkjs';

const nodeWidth = 172;
const nodeHeight = 36;

const getDagreLayout = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const getD3HierarchyLayout = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  const rootNode = nodes.find(n => !edges.some(e => e.target === n.id)) || nodes[0];

  const hierarchyData = hierarchy<Node>(
    rootNode,
    (node) => edges.filter(edge => edge.source === node.id)
                   .map(edge => nodes.find(n => n.id === edge.target))
                   .filter((n): n is Node => n !== undefined)
  );

  const layout = tree<Node>().size([1200, 800]);
  const layoutedRoot = layout(hierarchyData);

  const layoutedNodes: Node[] = layoutedRoot.descendants().map((d: HierarchyNode<Node>) => {
    return {
      ...d.data,
      position: { x: d.x ?? 0, y: d.y ?? 0 },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const getElkLayout = async (nodes: Node[], edges: Edge[]): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const elk = new ELK();
  const elkNodes: ElkNode[] = nodes.map(node => ({ id: node.id, width: nodeWidth, height: nodeHeight }));
  const elkEdges: ElkExtendedEdge[] = edges.map(edge => ({ id: edge.id, sources: [edge.source], targets: [edge.target] }));

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: { 'elk.algorithm': 'layered' },
    children: elkNodes,
    edges: elkEdges,
  };

  const layoutedGraph = await elk.layout(graph);
  const layoutedNodes: Node[] = layoutedGraph.children?.map((elkNode: ElkNode) => {
    const originalNode = nodes.find(n => n.id === elkNode.id)!;
    return {
      ...originalNode,
      position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
    };
  }) || [];

  return { nodes: layoutedNodes, edges };
};

const getD3ForceLayout = (nodes: Node[], edges: Edge[]): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  interface ForceNode extends Node, SimulationNodeDatum {}

  return new Promise((resolve) => {
    const simulation = forceSimulation(nodes as ForceNode[])
      .force('link', forceLink(edges).id((d) => (d as ForceNode).id).distance(150))
      .force('charge', forceManyBody().strength(-400))
      .stop();

    simulation.tick(300);

    const layoutedNodes: Node[] = (nodes as ForceNode[]).map(node => {
      const { x, y, ...rest } = node;
      return {
        ...rest,
        position: { x: x ?? 0, y: y ?? 0 },
      };
    });

    resolve({ nodes: layoutedNodes, edges });
  });
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  layout: string
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  switch (layout) {
    case 'dagre':
      return Promise.resolve(getDagreLayout(nodes, edges, 'TB'));
    case 'd3-hierarchy':
      return Promise.resolve(getD3HierarchyLayout(nodes, edges));
    case 'elk':
      return getElkLayout(nodes, edges);
    case 'd3-force':
      return getD3ForceLayout(nodes, edges);
    default:
      return Promise.resolve({ nodes, edges });
  }
};

