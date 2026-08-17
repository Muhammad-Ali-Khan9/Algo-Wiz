import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { TreeAlgoId } from "./types";

export const TREE_CODE: Record<TreeAlgoId, CodeSnippets> = {
  "bt-preorder": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* node_new(int key) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->key = key; n->left = n->right = NULL;
    return n;
}

void preorder(Node* n, int* out, int* k) {
    if (!n) return;
    out[(*k)++] = n->key;
    preorder(n->left, out, k);
    preorder(n->right, out, k);
}

int preorder_iter(Node* root, int* out) {
    Node* stack[256];
    int top = 0, k = 0;
    if (root) stack[top++] = root;
    while (top > 0) {
        Node* n = stack[--top];
        out[k++] = n->key;
        if (n->right) stack[top++] = n->right;
        if (n->left) stack[top++] = n->left;
    }
    return k;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

void preorder(Node* n, vector<int>& out) {
    if (!n) return;
    out.push_back(n->key);
    preorder(n->left, out);
    preorder(n->right, out);
}

vector<int> preorder_iter(Node* root) {
    vector<int> out;
    vector<Node*> st;
    if (root) st.push_back(root);
    while (!st.empty()) {
        Node* n = st.back(); st.pop_back();
        out.push_back(n->key);
        if (n->right) st.push_back(n->right);
        if (n->left) st.push_back(n->left);
    }
    return out;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def preorder(node, out=None):
    if out is None:
        out = []
    if node is not None:
        out.append(node.key)
        preorder(node.left, out)
        preorder(node.right, out)
    return out


def preorder_iter(root):
    out = []
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        out.append(node.key)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return out`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class Preorder {
    static void walk(Node n, List<Integer> out) {
        if (n == null) return;
        out.add(n.key);
        walk(n.left, out);
        walk(n.right, out);
    }

    static List<Integer> iterative(Node root) {
        List<Integer> out = new ArrayList<>();
        Deque<Node> st = new ArrayDeque<>();
        if (root != null) st.push(root);
        while (!st.isEmpty()) {
            Node n = st.pop();
            out.add(n.key);
            if (n.right != null) st.push(n.right);
            if (n.left != null) st.push(n.left);
        }
        return out;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function preorder(node, out = []) {
  if (!node) return out;
  out.push(node.key);
  preorder(node.left, out);
  preorder(node.right, out);
  return out;
}

function preorderIter(root) {
  const out = [];
  const stack = root ? [root] : [];
  while (stack.length) {
    const n = stack.pop();
    out.push(n.key);
    if (n.right) stack.push(n.right);
    if (n.left) stack.push(n.left);
  }
  return out;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class Preorder {
    public static void Walk(Node? n, List<int> acc) {
        if (n == null) return;
        acc.Add(n.Key);
        Walk(n.Left, acc);
        Walk(n.Right, acc);
    }

    public static List<int> Iterative(Node? root) {
        var acc = new List<int>();
        var st = new Stack<Node>();
        if (root != null) st.Push(root);
        while (st.Count > 0) {
            Node n = st.Pop();
            acc.Add(n.Key);
            if (n.Right != null) st.Push(n.Right);
            if (n.Left != null) st.Push(n.Left);
        }
        return acc;
    }
}`,
  ),

  "bt-inorder": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

void inorder(Node* n, int* out, int* k) {
    if (!n) return;
    inorder(n->left, out, k);
    out[(*k)++] = n->key;
    inorder(n->right, out, k);
}

int inorder_iter(Node* root, int* out) {
    Node* stack[256];
    int top = 0, k = 0;
    Node* cur = root;
    while (cur || top > 0) {
        while (cur) { stack[top++] = cur; cur = cur->left; }
        cur = stack[--top];
        out[k++] = cur->key;
        cur = cur->right;
    }
    return k;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

void inorder(Node* n, vector<int>& out) {
    if (!n) return;
    inorder(n->left, out);
    out.push_back(n->key);
    inorder(n->right, out);
}

vector<int> inorder_iter(Node* root) {
    vector<int> out;
    vector<Node*> st;
    Node* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push_back(cur); cur = cur->left; }
        cur = st.back(); st.pop_back();
        out.push_back(cur->key);
        cur = cur->right;
    }
    return out;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def inorder(node, out=None):
    if out is None:
        out = []
    if node is not None:
        inorder(node.left, out)
        out.append(node.key)
        inorder(node.right, out)
    return out


def inorder_iter(root):
    out, stack, cur = [], [], root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.key)
        cur = cur.right
    return out`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class Inorder {
    static void walk(Node n, List<Integer> out) {
        if (n == null) return;
        walk(n.left, out);
        out.add(n.key);
        walk(n.right, out);
    }

    static List<Integer> iterative(Node root) {
        List<Integer> out = new ArrayList<>();
        Deque<Node> st = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop();
            out.add(cur.key);
            cur = cur.right;
        }
        return out;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.key);
  inorder(node.right, out);
  return out;
}

function inorderIter(root) {
  const out = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    out.push(cur.key);
    cur = cur.right;
  }
  return out;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class Inorder {
    public static void Walk(Node? n, List<int> acc) {
        if (n == null) return;
        Walk(n.Left, acc);
        acc.Add(n.Key);
        Walk(n.Right, acc);
    }

    public static List<int> Iterative(Node? root) {
        var acc = new List<int>();
        var st = new Stack<Node>();
        Node? cur = root;
        while (cur != null || st.Count > 0) {
            while (cur != null) { st.Push(cur); cur = cur.Left; }
            cur = st.Pop();
            acc.Add(cur.Key);
            cur = cur.Right;
        }
        return acc;
    }
}`,
  ),

  "bt-postorder": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

void postorder(Node* n, int* out, int* k) {
    if (!n) return;
    postorder(n->left, out, k);
    postorder(n->right, out, k);
    out[(*k)++] = n->key;
}

int postorder_iter(Node* root, int* out) {
    Node* s1[256]; Node* s2[256];
    int t1 = 0, t2 = 0, k = 0;
    if (root) s1[t1++] = root;
    while (t1 > 0) {
        Node* n = s1[--t1];
        s2[t2++] = n;
        if (n->left) s1[t1++] = n->left;
        if (n->right) s1[t1++] = n->right;
    }
    while (t2 > 0) out[k++] = s2[--t2]->key;
    return k;
}

void free_tree(Node* n) {
    if (!n) return;
    free_tree(n->left);
    free_tree(n->right);
    free(n);
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

void postorder(Node* n, vector<int>& out) {
    if (!n) return;
    postorder(n->left, out);
    postorder(n->right, out);
    out.push_back(n->key);
}

vector<int> postorder_iter(Node* root) {
    vector<int> out;
    vector<Node*> st;
    if (root) st.push_back(root);
    while (!st.empty()) {
        Node* n = st.back(); st.pop_back();
        out.push_back(n->key);
        if (n->left) st.push_back(n->left);
        if (n->right) st.push_back(n->right);
    }
    reverse(out.begin(), out.end());
    return out;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def postorder(node, out=None):
    if out is None:
        out = []
    if node is not None:
        postorder(node.left, out)
        postorder(node.right, out)
        out.append(node.key)
    return out


def postorder_iter(root):
    out = []
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        out.append(node.key)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    out.reverse()
    return out`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class Postorder {
    static void walk(Node n, List<Integer> out) {
        if (n == null) return;
        walk(n.left, out);
        walk(n.right, out);
        out.add(n.key);
    }

    static List<Integer> iterative(Node root) {
        LinkedList<Integer> out = new LinkedList<>();
        Deque<Node> st = new ArrayDeque<>();
        if (root != null) st.push(root);
        while (!st.isEmpty()) {
            Node n = st.pop();
            out.addFirst(n.key);
            if (n.left != null) st.push(n.left);
            if (n.right != null) st.push(n.right);
        }
        return out;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function postorder(node, out = []) {
  if (!node) return out;
  postorder(node.left, out);
  postorder(node.right, out);
  out.push(node.key);
  return out;
}

function postorderIter(root) {
  const out = [];
  const stack = root ? [root] : [];
  while (stack.length) {
    const n = stack.pop();
    out.push(n.key);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  out.reverse();
  return out;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class Postorder {
    public static void Walk(Node? n, List<int> acc) {
        if (n == null) return;
        Walk(n.Left, acc);
        Walk(n.Right, acc);
        acc.Add(n.Key);
    }

    public static List<int> Iterative(Node? root) {
        var acc = new List<int>();
        var st = new Stack<Node>();
        if (root != null) st.Push(root);
        while (st.Count > 0) {
            Node n = st.Pop();
            acc.Add(n.Key);
            if (n.Left != null) st.Push(n.Left);
            if (n.Right != null) st.Push(n.Right);
        }
        acc.Reverse();
        return acc;
    }
}`,
  ),

  "bt-levelorder": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

int level_order(Node* root, int* out) {
    Node* q[256];
    int head = 0, tail = 0, k = 0;
    if (root) q[tail++] = root;
    while (head < tail) {
        Node* n = q[head++];
        out[k++] = n->key;
        if (n->left) q[tail++] = n->left;
        if (n->right) q[tail++] = n->right;
    }
    return k;
}

int level_widths(Node* root, int* widths) {
    Node* q[256];
    int head = 0, tail = 0, levels = 0;
    if (root) q[tail++] = root;
    while (head < tail) {
        int count = tail - head;
        widths[levels++] = count;
        while (count-- > 0) {
            Node* n = q[head++];
            if (n->left) q[tail++] = n->left;
            if (n->right) q[tail++] = n->right;
        }
    }
    return levels;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

vector<int> level_order(Node* root) {
    vector<int> out;
    if (!root) return out;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* n = q.front(); q.pop();
        out.push_back(n->key);
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
    return out;
}

vector<vector<int>> by_level(Node* root) {
    vector<vector<int>> levels;
    if (!root) return levels;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int count = (int)q.size();
        vector<int> row;
        while (count-- > 0) {
            Node* n = q.front(); q.pop();
            row.push_back(n->key);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        levels.push_back(row);
    }
    return levels;
}`,
    `from collections import deque


class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def level_order(root):
    out = []
    if not root:
        return out
    q = deque([root])
    while q:
        node = q.popleft()
        out.append(node.key)
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return out


def by_level(root):
    levels = []
    if not root:
        return levels
    q = deque([root])
    while q:
        row = []
        for _ in range(len(q)):
            node = q.popleft()
            row.append(node.key)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        levels.append(row)
    return levels`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class LevelOrder {
    static List<Integer> flat(Node root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Queue<Node> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            Node n = q.remove();
            out.add(n.key);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        return out;
    }

    static List<List<Integer>> byLevel(Node root) {
        List<List<Integer>> levels = new ArrayList<>();
        if (root == null) return levels;
        Queue<Node> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int count = q.size();
            List<Integer> row = new ArrayList<>();
            while (count-- > 0) {
                Node n = q.remove();
                row.add(n.key);
                if (n.left != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
            levels.add(row);
        }
        return levels;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function levelOrder(root) {
  const out = [];
  if (!root) return out;
  const q = [root];
  let head = 0;
  while (head < q.length) {
    const n = q[head++];
    out.push(n.key);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return out;
}

function byLevel(root) {
  const levels = [];
  let frontier = root ? [root] : [];
  while (frontier.length) {
    levels.push(frontier.map((n) => n.key));
    const next = [];
    for (const n of frontier) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    frontier = next;
  }
  return levels;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class LevelOrder {
    public static List<int> Flat(Node? root) {
        var acc = new List<int>();
        if (root == null) return acc;
        var q = new Queue<Node>();
        q.Enqueue(root);
        while (q.Count > 0) {
            Node n = q.Dequeue();
            acc.Add(n.Key);
            if (n.Left != null) q.Enqueue(n.Left);
            if (n.Right != null) q.Enqueue(n.Right);
        }
        return acc;
    }

    public static List<List<int>> ByLevel(Node? root) {
        var levels = new List<List<int>>();
        if (root == null) return levels;
        var q = new Queue<Node>();
        q.Enqueue(root);
        while (q.Count > 0) {
            int count = q.Count;
            var row = new List<int>();
            while (count-- > 0) {
                Node n = q.Dequeue();
                row.Add(n.Key);
                if (n.Left != null) q.Enqueue(n.Left);
                if (n.Right != null) q.Enqueue(n.Right);
            }
            levels.Add(row);
        }
        return levels;
    }
}`,
  ),

  "bt-height": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

int height(Node* n) {
    if (!n) return -1;
    int l = height(n->left);
    int r = height(n->right);
    return 1 + (l > r ? l : r);
}

int height_iter(Node* root) {
    Node* q[256];
    int head = 0, tail = 0, h = -1;
    if (root) q[tail++] = root;
    while (head < tail) {
        int count = tail - head;
        h++;
        while (count-- > 0) {
            Node* n = q[head++];
            if (n->left) q[tail++] = n->left;
            if (n->right) q[tail++] = n->right;
        }
    }
    return h;
}

int size(Node* n) {
    return n ? 1 + size(n->left) + size(n->right) : 0;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int height(Node* n) {
    if (!n) return -1;
    return 1 + max(height(n->left), height(n->right));
}

int height_iter(Node* root) {
    if (!root) return -1;
    queue<Node*> q;
    q.push(root);
    int h = -1;
    while (!q.empty()) {
        int count = (int)q.size();
        h++;
        while (count-- > 0) {
            Node* n = q.front(); q.pop();
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
    }
    return h;
}

bool is_balanced(Node* n, int& h) {
    if (!n) { h = -1; return true; }
    int lh = 0, rh = 0;
    bool ok = is_balanced(n->left, lh) && is_balanced(n->right, rh);
    h = 1 + max(lh, rh);
    return ok && abs(lh - rh) <= 1;
}`,
    `from collections import deque


class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))


def height_iter(root):
    if not root:
        return -1
    q = deque([root])
    h = -1
    while q:
        h += 1
        for _ in range(len(q)):
            node = q.popleft()
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return h


def size(node):
    if node is None:
        return 0
    return 1 + size(node.left) + size(node.right)`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class Height {
    static int height(Node n) {
        if (n == null) return -1;
        return 1 + Math.max(height(n.left), height(n.right));
    }

    static int heightIter(Node root) {
        if (root == null) return -1;
        Queue<Node> q = new ArrayDeque<>();
        q.add(root);
        int h = -1;
        while (!q.isEmpty()) {
            int count = q.size();
            h++;
            while (count-- > 0) {
                Node n = q.remove();
                if (n.left != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
        }
        return h;
    }

    static int size(Node n) {
        return n == null ? 0 : 1 + size(n.left) + size(n.right);
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function height(node) {
  if (!node) return -1;
  return 1 + Math.max(height(node.left), height(node.right));
}

function heightIter(root) {
  let frontier = root ? [root] : [];
  let h = -1;
  while (frontier.length) {
    h++;
    const next = [];
    for (const n of frontier) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    frontier = next;
  }
  return h;
}

function size(node) {
  return node ? 1 + size(node.left) + size(node.right) : 0;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class Height {
    public static int Of(Node? n) {
        if (n == null) return -1;
        return 1 + Math.Max(Of(n.Left), Of(n.Right));
    }

    public static int Iterative(Node? root) {
        if (root == null) return -1;
        var q = new Queue<Node>();
        q.Enqueue(root);
        int h = -1;
        while (q.Count > 0) {
            int count = q.Count;
            h++;
            while (count-- > 0) {
                Node n = q.Dequeue();
                if (n.Left != null) q.Enqueue(n.Left);
                if (n.Right != null) q.Enqueue(n.Right);
            }
        }
        return h;
    }

    public static int Size(Node? n) =>
        n == null ? 0 : 1 + Size(n.Left) + Size(n.Right);
}`,
  ),

  "bt-depth": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

int depth_from(Node* n, int key, int d) {
    if (!n) return -1;
    if (n->key == key) return d;
    int left = depth_from(n->left, key, d + 1);
    if (left >= 0) return left;
    return depth_from(n->right, key, d + 1);
}

int depth(Node* root, int key) { return depth_from(root, key, 0); }

int depth_iter(Node* root, int key) {
    Node* q[256];
    int qd[256];
    int head = 0, tail = 0;
    if (root) { q[tail] = root; qd[tail++] = 0; }
    while (head < tail) {
        Node* n = q[head];
        int d = qd[head++];
        if (n->key == key) return d;
        if (n->left) { q[tail] = n->left; qd[tail++] = d + 1; }
        if (n->right) { q[tail] = n->right; qd[tail++] = d + 1; }
    }
    return -1;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int depth(Node* n, int key, int d = 0) {
    if (!n) return -1;
    if (n->key == key) return d;
    int left = depth(n->left, key, d + 1);
    return left >= 0 ? left : depth(n->right, key, d + 1);
}

int depth_iter(Node* root, int key) {
    queue<pair<Node*, int>> q;
    if (root) q.push({root, 0});
    while (!q.empty()) {
        auto [n, d] = q.front(); q.pop();
        if (n->key == key) return d;
        if (n->left) q.push({n->left, d + 1});
        if (n->right) q.push({n->right, d + 1});
    }
    return -1;
}

void depths(Node* n, int d, vector<int>& out) {
    if (!n) return;
    out.push_back(d);
    depths(n->left, d + 1, out);
    depths(n->right, d + 1, out);
}`,
    `from collections import deque


class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def depth(node, key, d=0):
    if node is None:
        return -1
    if node.key == key:
        return d
    left = depth(node.left, key, d + 1)
    if left >= 0:
        return left
    return depth(node.right, key, d + 1)


def depth_iter(root, key):
    q = deque([(root, 0)] if root else [])
    while q:
        node, d = q.popleft()
        if node.key == key:
            return d
        if node.left:
            q.append((node.left, d + 1))
        if node.right:
            q.append((node.right, d + 1))
    return -1`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class Depth {
    static int depth(Node n, int key, int d) {
        if (n == null) return -1;
        if (n.key == key) return d;
        int left = depth(n.left, key, d + 1);
        if (left >= 0) return left;
        return depth(n.right, key, d + 1);
    }

    static int depth(Node root, int key) { return depth(root, key, 0); }

    static int depthIter(Node root, int key) {
        Deque<Node> nodes = new ArrayDeque<>();
        Deque<Integer> ds = new ArrayDeque<>();
        if (root != null) { nodes.add(root); ds.add(0); }
        while (!nodes.isEmpty()) {
            Node n = nodes.remove();
            int d = ds.remove();
            if (n.key == key) return d;
            if (n.left != null) { nodes.add(n.left); ds.add(d + 1); }
            if (n.right != null) { nodes.add(n.right); ds.add(d + 1); }
        }
        return -1;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function depth(node, key, d = 0) {
  if (!node) return -1;
  if (node.key === key) return d;
  const left = depth(node.left, key, d + 1);
  return left >= 0 ? left : depth(node.right, key, d + 1);
}

function depthIter(root, key) {
  const q = root ? [[root, 0]] : [];
  let head = 0;
  while (head < q.length) {
    const [n, d] = q[head++];
    if (n.key === key) return d;
    if (n.left) q.push([n.left, d + 1]);
    if (n.right) q.push([n.right, d + 1]);
  }
  return -1;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class Depth {
    public static int Of(Node? n, int key, int d = 0) {
        if (n == null) return -1;
        if (n.Key == key) return d;
        int left = Of(n.Left, key, d + 1);
        return left >= 0 ? left : Of(n.Right, key, d + 1);
    }

    public static int Iterative(Node? root, int key) {
        var q = new Queue<(Node node, int d)>();
        if (root != null) q.Enqueue((root, 0));
        while (q.Count > 0) {
            var (n, d) = q.Dequeue();
            if (n.Key == key) return d;
            if (n.Left != null) q.Enqueue((n.Left, d + 1));
            if (n.Right != null) q.Enqueue((n.Right, d + 1));
        }
        return -1;
    }
}`,
  ),

  "bt-search": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* bt_search(Node* n, int key) {
    if (!n || n->key == key) return n;
    Node* found = bt_search(n->left, key);
    return found ? found : bt_search(n->right, key);
}

Node* bt_search_bfs(Node* root, int key) {
    Node* q[256];
    int head = 0, tail = 0;
    if (root) q[tail++] = root;
    while (head < tail) {
        Node* n = q[head++];
        if (n->key == key) return n;
        if (n->left) q[tail++] = n->left;
        if (n->right) q[tail++] = n->right;
    }
    return NULL;
}

int count_key(Node* n, int key) {
    if (!n) return 0;
    return (n->key == key) + count_key(n->left, key) + count_key(n->right, key);
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bt_search(Node* n, int key) {
    if (!n || n->key == key) return n;
    if (Node* found = bt_search(n->left, key)) return found;
    return bt_search(n->right, key);
}

Node* bt_search_bfs(Node* root, int key) {
    queue<Node*> q;
    if (root) q.push(root);
    while (!q.empty()) {
        Node* n = q.front(); q.pop();
        if (n->key == key) return n;
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
    return nullptr;
}

bool path_to(Node* n, int key, vector<int>& path) {
    if (!n) return false;
    path.push_back(n->key);
    if (n->key == key) return true;
    if (path_to(n->left, key, path) || path_to(n->right, key, path)) return true;
    path.pop_back();
    return false;
}`,
    `from collections import deque


class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bt_search(node, key):
    if node is None or node.key == key:
        return node
    return bt_search(node.left, key) or bt_search(node.right, key)


def bt_search_bfs(root, key):
    q = deque([root] if root else [])
    while q:
        node = q.popleft()
        if node.key == key:
            return node
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return None


def path_to(node, key, path=None):
    if path is None:
        path = []
    if node is None:
        return None
    path.append(node.key)
    if node.key == key:
        return path
    if path_to(node.left, key, path) or path_to(node.right, key, path):
        return path
    path.pop()
    return None`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class BinarySearchAny {
    static Node search(Node n, int key) {
        if (n == null || n.key == key) return n;
        Node found = search(n.left, key);
        return found != null ? found : search(n.right, key);
    }

    static Node searchBfs(Node root, int key) {
        Queue<Node> q = new ArrayDeque<>();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node n = q.remove();
            if (n.key == key) return n;
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        return null;
    }

    static boolean pathTo(Node n, int key, List<Integer> path) {
        if (n == null) return false;
        path.add(n.key);
        if (n.key == key) return true;
        if (pathTo(n.left, key, path) || pathTo(n.right, key, path)) return true;
        path.remove(path.size() - 1);
        return false;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function btSearch(node, key) {
  if (!node || node.key === key) return node;
  return btSearch(node.left, key) || btSearch(node.right, key);
}

function btSearchBfs(root, key) {
  const q = root ? [root] : [];
  let head = 0;
  while (head < q.length) {
    const n = q[head++];
    if (n.key === key) return n;
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return null;
}

function pathTo(node, key, path = []) {
  if (!node) return null;
  path.push(node.key);
  if (node.key === key) return path;
  if (pathTo(node.left, key, path) || pathTo(node.right, key, path)) return path;
  path.pop();
  return null;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class BinaryTreeSearch {
    public static Node? Search(Node? n, int key) {
        if (n == null || n.Key == key) return n;
        return Search(n.Left, key) ?? Search(n.Right, key);
    }

    public static Node? SearchBfs(Node? root, int key) {
        var q = new Queue<Node>();
        if (root != null) q.Enqueue(root);
        while (q.Count > 0) {
            Node n = q.Dequeue();
            if (n.Key == key) return n;
            if (n.Left != null) q.Enqueue(n.Left);
            if (n.Right != null) q.Enqueue(n.Right);
        }
        return null;
    }

    public static bool PathTo(Node? n, int key, List<int> path) {
        if (n == null) return false;
        path.Add(n.Key);
        if (n.Key == key) return true;
        if (PathTo(n.Left, key, path) || PathTo(n.Right, key, path)) return true;
        path.RemoveAt(path.Count - 1);
        return false;
    }
}`,
  ),

  "bst-insert": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* node_new(int key) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->key = key; n->left = n->right = NULL;
    return n;
}

Node* bst_insert(Node* root, int key) {
    if (!root) return node_new(key);
    if (key < root->key) root->left = bst_insert(root->left, key);
    else if (key > root->key) root->right = bst_insert(root->right, key);
    return root;
}

Node* bst_insert_iter(Node* root, int key) {
    Node* fresh = node_new(key);
    if (!root) return fresh;
    Node* cur = root;
    while (1) {
        if (key < cur->key) {
            if (!cur->left) { cur->left = fresh; return root; }
            cur = cur->left;
        } else if (key > cur->key) {
            if (!cur->right) { cur->right = fresh; return root; }
            cur = cur->right;
        } else { free(fresh); return root; }
    }
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bst_insert(Node* root, int key) {
    if (!root) return new Node(key);
    if (key < root->key) root->left = bst_insert(root->left, key);
    else if (key > root->key) root->right = bst_insert(root->right, key);
    return root;
}

Node* bst_insert_iter(Node* root, int key) {
    Node** slot = &root;
    while (*slot) {
        if (key < (*slot)->key) slot = &(*slot)->left;
        else if (key > (*slot)->key) slot = &(*slot)->right;
        else return root;
    }
    *slot = new Node(key);
    return root;
}

Node* build(const vector<int>& keys) {
    Node* root = nullptr;
    for (int k : keys) root = bst_insert(root, k);
    return root;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bst_insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = bst_insert(root.left, key)
    elif key > root.key:
        root.right = bst_insert(root.right, key)
    return root


def bst_insert_iter(root, key):
    fresh = Node(key)
    if root is None:
        return fresh
    cur = root
    while True:
        if key < cur.key:
            if cur.left is None:
                cur.left = fresh
                return root
            cur = cur.left
        elif key > cur.key:
            if cur.right is None:
                cur.right = fresh
                return root
            cur = cur.right
        else:
            return root


def build(keys):
    root = None
    for k in keys:
        root = bst_insert(root, k)
    return root`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class Bst {
    Node root;

    void insert(int key) { root = insert(root, key); }

    static Node insert(Node n, int key) {
        if (n == null) return new Node(key);
        if (key < n.key) n.left = insert(n.left, key);
        else if (key > n.key) n.right = insert(n.right, key);
        return n;
    }

    void insertIter(int key) {
        Node fresh = new Node(key);
        if (root == null) { root = fresh; return; }
        Node cur = root;
        while (true) {
            if (key < cur.key) {
                if (cur.left == null) { cur.left = fresh; return; }
                cur = cur.left;
            } else if (key > cur.key) {
                if (cur.right == null) { cur.right = fresh; return; }
                cur = cur.right;
            } else return;
        }
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class Bst {
  constructor() {
    this.root = null;
  }

  insert(key) {
    const fresh = new Node(key);
    if (!this.root) {
      this.root = fresh;
      return this;
    }
    let cur = this.root;
    for (;;) {
      if (key < cur.key) {
        if (!cur.left) {
          cur.left = fresh;
          return this;
        }
        cur = cur.left;
      } else if (key > cur.key) {
        if (!cur.right) {
          cur.right = fresh;
          return this;
        }
        cur = cur.right;
      } else return this;
    }
  }
}

function insertRec(node, key) {
  if (!node) return new Node(key);
  if (key < node.key) node.left = insertRec(node.left, key);
  else if (key > node.key) node.right = insertRec(node.right, key);
  return node;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

class Bst {
    public Node? Root { get; private set; }

    public void Insert(int key) { Root = Insert(Root, key); }

    static Node Insert(Node? n, int key) {
        if (n == null) return new Node(key);
        if (key < n.Key) n.Left = Insert(n.Left, key);
        else if (key > n.Key) n.Right = Insert(n.Right, key);
        return n;
    }

    public void InsertIterative(int key) {
        var fresh = new Node(key);
        if (Root == null) { Root = fresh; return; }
        Node cur = Root;
        while (true) {
            if (key < cur.Key) {
                if (cur.Left == null) { cur.Left = fresh; return; }
                cur = cur.Left;
            } else if (key > cur.Key) {
                if (cur.Right == null) { cur.Right = fresh; return; }
                cur = cur.Right;
            } else return;
        }
    }
}`,
  ),

  "bst-search": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* bst_search(Node* root, int key) {
    while (root) {
        if (key == root->key) return root;
        root = key < root->key ? root->left : root->right;
    }
    return NULL;
}

Node* bst_search_rec(Node* root, int key) {
    if (!root || root->key == key) return root;
    if (key < root->key) return bst_search_rec(root->left, key);
    return bst_search_rec(root->right, key);
}

int bst_contains(Node* root, int key) { return bst_search(root, key) != NULL; }

int bst_depth_of(Node* root, int key) {
    int d = 0;
    while (root) {
        if (root->key == key) return d;
        root = key < root->key ? root->left : root->right;
        d++;
    }
    return -1;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bst_search(Node* root, int key) {
    while (root) {
        if (key == root->key) return root;
        root = key < root->key ? root->left : root->right;
    }
    return nullptr;
}

Node* bst_search_rec(Node* root, int key) {
    if (!root || root->key == key) return root;
    return key < root->key ? bst_search_rec(root->left, key)
                           : bst_search_rec(root->right, key);
}

vector<int> search_path(Node* root, int key) {
    vector<int> path;
    while (root) {
        path.push_back(root->key);
        if (root->key == key) break;
        root = key < root->key ? root->left : root->right;
    }
    return path;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bst_search(root, key):
    while root is not None:
        if key == root.key:
            return root
        root = root.left if key < root.key else root.right
    return None


def bst_search_rec(root, key):
    if root is None or root.key == key:
        return root
    if key < root.key:
        return bst_search_rec(root.left, key)
    return bst_search_rec(root.right, key)


def search_path(root, key):
    path = []
    while root is not None:
        path.append(root.key)
        if root.key == key:
            break
        root = root.left if key < root.key else root.right
    return path`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class BstSearch {
    static Node search(Node root, int key) {
        while (root != null) {
            if (key == root.key) return root;
            root = key < root.key ? root.left : root.right;
        }
        return null;
    }

    static Node searchRec(Node root, int key) {
        if (root == null || root.key == key) return root;
        return key < root.key ? searchRec(root.left, key) : searchRec(root.right, key);
    }

    static List<Integer> searchPath(Node root, int key) {
        List<Integer> path = new ArrayList<>();
        while (root != null) {
            path.add(root.key);
            if (root.key == key) break;
            root = key < root.key ? root.left : root.right;
        }
        return path;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function bstSearch(root, key) {
  let cur = root;
  while (cur) {
    if (key === cur.key) return cur;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return null;
}

function bstSearchRec(node, key) {
  if (!node || node.key === key) return node;
  return key < node.key ? bstSearchRec(node.left, key) : bstSearchRec(node.right, key);
}

function searchPath(root, key) {
  const path = [];
  let cur = root;
  while (cur) {
    path.push(cur.key);
    if (cur.key === key) break;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return path;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class BstSearch {
    public static Node? Search(Node? root, int key) {
        while (root != null) {
            if (key == root.Key) return root;
            root = key < root.Key ? root.Left : root.Right;
        }
        return null;
    }

    public static Node? SearchRec(Node? root, int key) {
        if (root == null || root.Key == key) return root;
        return key < root.Key ? SearchRec(root.Left, key) : SearchRec(root.Right, key);
    }

    public static List<int> SearchPath(Node? root, int key) {
        var path = new List<int>();
        while (root != null) {
            path.Add(root.Key);
            if (root.Key == key) break;
            root = key < root.Key ? root.Left : root.Right;
        }
        return path;
    }
}`,
  ),

  "bst-delete": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* bst_min(Node* n) {
    while (n && n->left) n = n->left;
    return n;
}

Node* bst_delete(Node* root, int key) {
    if (!root) return NULL;
    if (key < root->key) {
        root->left = bst_delete(root->left, key);
    } else if (key > root->key) {
        root->right = bst_delete(root->right, key);
    } else {
        if (!root->left) {
            Node* r = root->right;
            free(root);
            return r;
        }
        if (!root->right) {
            Node* l = root->left;
            free(root);
            return l;
        }
        Node* succ = bst_min(root->right);
        root->key = succ->key;
        root->right = bst_delete(root->right, succ->key);
    }
    return root;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bst_min(Node* n) {
    while (n && n->left) n = n->left;
    return n;
}

Node* bst_delete(Node* root, int key) {
    if (!root) return nullptr;
    if (key < root->key) {
        root->left = bst_delete(root->left, key);
    } else if (key > root->key) {
        root->right = bst_delete(root->right, key);
    } else {
        if (!root->left || !root->right) {
            Node* child = root->left ? root->left : root->right;
            delete root;
            return child;
        }
        Node* succ = bst_min(root->right);
        root->key = succ->key;
        root->right = bst_delete(root->right, succ->key);
    }
    return root;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bst_min(node):
    while node and node.left:
        node = node.left
    return node


def bst_delete(root, key):
    if root is None:
        return None
    if key < root.key:
        root.left = bst_delete(root.left, key)
    elif key > root.key:
        root.right = bst_delete(root.right, key)
    else:
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left
        succ = bst_min(root.right)
        root.key = succ.key
        root.right = bst_delete(root.right, succ.key)
    return root`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class BstDelete {
    static Node min(Node n) {
        while (n != null && n.left != null) n = n.left;
        return n;
    }

    static Node delete(Node root, int key) {
        if (root == null) return null;
        if (key < root.key) {
            root.left = delete(root.left, key);
        } else if (key > root.key) {
            root.right = delete(root.right, key);
        } else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            Node succ = min(root.right);
            root.key = succ.key;
            root.right = delete(root.right, succ.key);
        }
        return root;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function bstMin(node) {
  let cur = node;
  while (cur && cur.left) cur = cur.left;
  return cur;
}

function bstDelete(root, key) {
  if (!root) return null;
  if (key < root.key) {
    root.left = bstDelete(root.left, key);
  } else if (key > root.key) {
    root.right = bstDelete(root.right, key);
  } else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const succ = bstMin(root.right);
    root.key = succ.key;
    root.right = bstDelete(root.right, succ.key);
  }
  return root;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class BstDelete {
    public static Node? Min(Node? n) {
        while (n != null && n.Left != null) n = n.Left;
        return n;
    }

    public static Node? Delete(Node? root, int key) {
        if (root == null) return null;
        if (key < root.Key) {
            root.Left = Delete(root.Left, key);
        } else if (key > root.Key) {
            root.Right = Delete(root.Right, key);
        } else {
            if (root.Left == null) return root.Right;
            if (root.Right == null) return root.Left;
            Node succ = Min(root.Right)!;
            root.Key = succ.Key;
            root.Right = Delete(root.Right, succ.Key);
        }
        return root;
    }
}`,
  ),

  "bst-minmax": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* bst_min(Node* root) {
    if (!root) return NULL;
    while (root->left) root = root->left;
    return root;
}

Node* bst_max(Node* root) {
    if (!root) return NULL;
    while (root->right) root = root->right;
    return root;
}

Node* bst_min_rec(Node* root) {
    if (!root || !root->left) return root;
    return bst_min_rec(root->left);
}

Node* bst_max_rec(Node* root) {
    if (!root || !root->right) return root;
    return bst_max_rec(root->right);
}

int bst_kth_smallest(Node* root, int k, int* count) {
    if (!root) return -1;
    int left = bst_kth_smallest(root->left, k, count);
    if (left != -1) return left;
    if (++(*count) == k) return root->key;
    return bst_kth_smallest(root->right, k, count);
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bst_min(Node* root) {
    if (!root) return nullptr;
    while (root->left) root = root->left;
    return root;
}

Node* bst_max(Node* root) {
    if (!root) return nullptr;
    while (root->right) root = root->right;
    return root;
}

pair<int, int> bst_range(Node* root) {
    Node* lo = bst_min(root);
    Node* hi = bst_max(root);
    return {lo ? lo->key : 0, hi ? hi->key : 0};
}

int kth_smallest(Node* root, int k) {
    vector<Node*> st;
    Node* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push_back(cur); cur = cur->left; }
        cur = st.back(); st.pop_back();
        if (--k == 0) return cur->key;
        cur = cur->right;
    }
    return -1;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bst_min(root):
    if root is None:
        return None
    while root.left:
        root = root.left
    return root


def bst_max(root):
    if root is None:
        return None
    while root.right:
        root = root.right
    return root


def bst_range(root):
    lo, hi = bst_min(root), bst_max(root)
    return (lo.key if lo else None, hi.key if hi else None)


def kth_smallest(root, k):
    stack, cur = [], root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        k -= 1
        if k == 0:
            return cur.key
        cur = cur.right
    return None`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class BstMinMax {
    static Node min(Node root) {
        if (root == null) return null;
        while (root.left != null) root = root.left;
        return root;
    }

    static Node max(Node root) {
        if (root == null) return null;
        while (root.right != null) root = root.right;
        return root;
    }

    static int kthSmallest(Node root, int k) {
        Deque<Node> st = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop();
            if (--k == 0) return cur.key;
            cur = cur.right;
        }
        return -1;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function bstMin(root) {
  if (!root) return null;
  let cur = root;
  while (cur.left) cur = cur.left;
  return cur;
}

function bstMax(root) {
  if (!root) return null;
  let cur = root;
  while (cur.right) cur = cur.right;
  return cur;
}

function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    if (--k === 0) return cur.key;
    cur = cur.right;
  }
  return null;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class BstMinMax {
    public static Node? Min(Node? root) {
        if (root == null) return null;
        while (root.Left != null) root = root.Left;
        return root;
    }

    public static Node? Max(Node? root) {
        if (root == null) return null;
        while (root.Right != null) root = root.Right;
        return root;
    }

    public static int KthSmallest(Node? root, int k) {
        var st = new Stack<Node>();
        Node? cur = root;
        while (cur != null || st.Count > 0) {
            while (cur != null) { st.Push(cur); cur = cur.Left; }
            cur = st.Pop();
            if (--k == 0) return cur.Key;
            cur = cur.Right;
        }
        return -1;
    }
}`,
  ),

  "bst-predecessor": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* bst_max(Node* n) {
    while (n && n->right) n = n->right;
    return n;
}

Node* bst_predecessor(Node* root, int key) {
    Node* best = NULL;
    Node* cur = root;
    while (cur) {
        if (key > cur->key) { best = cur; cur = cur->right; }
        else cur = cur->left;
    }
    return best;
}

Node* pred_of_node(Node* root, Node* target) {
    if (target->left) return bst_max(target->left);
    Node* best = NULL;
    Node* cur = root;
    while (cur && cur != target) {
        if (target->key > cur->key) { best = cur; cur = cur->right; }
        else cur = cur->left;
    }
    return best;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bst_max(Node* n) {
    while (n && n->right) n = n->right;
    return n;
}

Node* predecessor(Node* root, int key) {
    Node* best = nullptr;
    for (Node* cur = root; cur;) {
        if (key > cur->key) { best = cur; cur = cur->right; }
        else cur = cur->left;
    }
    return best;
}

Node* pred_of_node(Node* root, Node* target) {
    if (target->left) return bst_max(target->left);
    Node* best = nullptr;
    for (Node* cur = root; cur && cur != target;) {
        if (target->key > cur->key) { best = cur; cur = cur->right; }
        else cur = cur->left;
    }
    return best;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bst_max(node):
    while node and node.right:
        node = node.right
    return node


def predecessor(root, key):
    best, cur = None, root
    while cur:
        if key > cur.key:
            best = cur
            cur = cur.right
        else:
            cur = cur.left
    return best


def pred_of_node(root, target):
    if target.left:
        return bst_max(target.left)
    best, cur = None, root
    while cur is not None and cur is not target:
        if target.key > cur.key:
            best = cur
            cur = cur.right
        else:
            cur = cur.left
    return best`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class BstPredecessor {
    static Node max(Node n) {
        while (n != null && n.right != null) n = n.right;
        return n;
    }

    static Node predecessor(Node root, int key) {
        Node best = null, cur = root;
        while (cur != null) {
            if (key > cur.key) { best = cur; cur = cur.right; }
            else cur = cur.left;
        }
        return best;
    }

    static Node predOfNode(Node root, Node target) {
        if (target.left != null) return max(target.left);
        Node best = null, cur = root;
        while (cur != null && cur != target) {
            if (target.key > cur.key) { best = cur; cur = cur.right; }
            else cur = cur.left;
        }
        return best;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function bstMax(node) {
  let cur = node;
  while (cur && cur.right) cur = cur.right;
  return cur;
}

function predecessor(root, key) {
  let best = null;
  let cur = root;
  while (cur) {
    if (key > cur.key) {
      best = cur;
      cur = cur.right;
    } else cur = cur.left;
  }
  return best;
}

function predOfNode(root, target) {
  if (target.left) return bstMax(target.left);
  let best = null;
  let cur = root;
  while (cur && cur !== target) {
    if (target.key > cur.key) {
      best = cur;
      cur = cur.right;
    } else cur = cur.left;
  }
  return best;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class BstPredecessor {
    public static Node? Max(Node? n) {
        while (n != null && n.Right != null) n = n.Right;
        return n;
    }

    public static Node? Predecessor(Node? root, int key) {
        Node? best = null;
        Node? cur = root;
        while (cur != null) {
            if (key > cur.Key) { best = cur; cur = cur.Right; }
            else cur = cur.Left;
        }
        return best;
    }

    public static Node? PredOfNode(Node? root, Node target) {
        if (target.Left != null) return Max(target.Left);
        Node? best = null;
        Node? cur = root;
        while (cur != null && cur != target) {
            if (target.Key > cur.Key) { best = cur; cur = cur.Right; }
            else cur = cur.Left;
        }
        return best;
    }
}`,
  ),

  "bst-successor": snippets(
    `typedef struct Node { int key; struct Node *left, *right; } Node;

Node* bst_min(Node* n) {
    while (n && n->left) n = n->left;
    return n;
}

Node* bst_successor(Node* root, int key) {
    Node* best = NULL;
    Node* cur = root;
    while (cur) {
        if (key < cur->key) { best = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return best;
}

Node* succ_of_node(Node* root, Node* target) {
    if (target->right) return bst_min(target->right);
    Node* best = NULL;
    Node* cur = root;
    while (cur && cur != target) {
        if (target->key < cur->key) { best = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return best;
}`,
    `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* bst_min(Node* n) {
    while (n && n->left) n = n->left;
    return n;
}

Node* successor(Node* root, int key) {
    Node* best = nullptr;
    for (Node* cur = root; cur;) {
        if (key < cur->key) { best = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return best;
}

Node* succ_of_node(Node* root, Node* target) {
    if (target->right) return bst_min(target->right);
    Node* best = nullptr;
    for (Node* cur = root; cur && cur != target;) {
        if (target->key < cur->key) { best = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return best;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


def bst_min(node):
    while node and node.left:
        node = node.left
    return node


def successor(root, key):
    best, cur = None, root
    while cur:
        if key < cur.key:
            best = cur
            cur = cur.left
        else:
            cur = cur.right
    return best


def succ_of_node(root, target):
    if target.right:
        return bst_min(target.right)
    best, cur = None, root
    while cur is not None and cur is not target:
        if target.key < cur.key:
            best = cur
            cur = cur.left
        else:
            cur = cur.right
    return best`,
    `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

class BstSuccessor {
    static Node min(Node n) {
        while (n != null && n.left != null) n = n.left;
        return n;
    }

    static Node successor(Node root, int key) {
        Node best = null, cur = root;
        while (cur != null) {
            if (key < cur.key) { best = cur; cur = cur.left; }
            else cur = cur.right;
        }
        return best;
    }

    static Node succOfNode(Node root, Node target) {
        if (target.right != null) return min(target.right);
        Node best = null, cur = root;
        while (cur != null && cur != target) {
            if (target.key < cur.key) { best = cur; cur = cur.left; }
            else cur = cur.right;
        }
        return best;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function bstMin(node) {
  let cur = node;
  while (cur && cur.left) cur = cur.left;
  return cur;
}

function successor(root, key) {
  let best = null;
  let cur = root;
  while (cur) {
    if (key < cur.key) {
      best = cur;
      cur = cur.left;
    } else cur = cur.right;
  }
  return best;
}

function succOfNode(root, target) {
  if (target.right) return bstMin(target.right);
  let best = null;
  let cur = root;
  while (cur && cur !== target) {
    if (target.key < cur.key) {
      best = cur;
      cur = cur.left;
    } else cur = cur.right;
  }
  return best;
}`,
    `class Node {
    public int Key;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class BstSuccessor {
    public static Node? Min(Node? n) {
        while (n != null && n.Left != null) n = n.Left;
        return n;
    }

    public static Node? Successor(Node? root, int key) {
        Node? best = null;
        Node? cur = root;
        while (cur != null) {
            if (key < cur.Key) { best = cur; cur = cur.Left; }
            else cur = cur.Right;
        }
        return best;
    }

    public static Node? SuccOfNode(Node? root, Node target) {
        if (target.Right != null) return Min(target.Right);
        Node? best = null;
        Node? cur = root;
        while (cur != null && cur != target) {
            if (target.Key < cur.Key) { best = cur; cur = cur.Left; }
            else cur = cur.Right;
        }
        return best;
    }
}`,
  ),

  "avl-insert": snippets(
    `typedef struct Node { int key, height; struct Node *left, *right; } Node;

static int h(Node* n) { return n ? n->height : 0; }
static int max2(int a, int b) { return a > b ? a : b; }
static int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

Node* node_new(int key) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->key = key; n->height = 1; n->left = n->right = NULL;
    return n;
}

Node* rotate_right(Node* y) {
    Node* x = y->left;
    y->left = x->right;
    x->right = y;
    y->height = 1 + max2(h(y->left), h(y->right));
    x->height = 1 + max2(h(x->left), h(x->right));
    return x;
}

Node* rotate_left(Node* x) {
    Node* y = x->right;
    x->right = y->left;
    y->left = x;
    x->height = 1 + max2(h(x->left), h(x->right));
    y->height = 1 + max2(h(y->left), h(y->right));
    return y;
}

Node* avl_insert(Node* n, int key) {
    if (!n) return node_new(key);
    if (key < n->key) n->left = avl_insert(n->left, key);
    else if (key > n->key) n->right = avl_insert(n->right, key);
    else return n;
    n->height = 1 + max2(h(n->left), h(n->right));
    int b = bf(n);
    if (b > 1 && key < n->left->key) return rotate_right(n);
    if (b < -1 && key > n->right->key) return rotate_left(n);
    if (b > 1 && key > n->left->key) {
        n->left = rotate_left(n->left);
        return rotate_right(n);
    }
    if (b < -1 && key < n->right->key) {
        n->right = rotate_right(n->right);
        return rotate_left(n);
    }
    return n;
}`,
    `struct Node {
    int key, height = 1;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int h(Node* n) { return n ? n->height : 0; }
int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }
void fix(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }

Node* rotate_right(Node* y) {
    Node* x = y->left;
    y->left = x->right;
    x->right = y;
    fix(y); fix(x);
    return x;
}

Node* rotate_left(Node* x) {
    Node* y = x->right;
    x->right = y->left;
    y->left = x;
    fix(x); fix(y);
    return y;
}

Node* avl_insert(Node* n, int key) {
    if (!n) return new Node(key);
    if (key < n->key) n->left = avl_insert(n->left, key);
    else if (key > n->key) n->right = avl_insert(n->right, key);
    else return n;
    fix(n);
    int b = bf(n);
    if (b > 1 && key < n->left->key) return rotate_right(n);
    if (b < -1 && key > n->right->key) return rotate_left(n);
    if (b > 1) { n->left = rotate_left(n->left); return rotate_right(n); }
    if (b < -1) { n->right = rotate_right(n->right); return rotate_left(n); }
    return n;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None


def height(node):
    return node.height if node else 0


def balance(node):
    return height(node.left) - height(node.right) if node else 0


def fix(node):
    node.height = 1 + max(height(node.left), height(node.right))


def rotate_right(y):
    x = y.left
    y.left = x.right
    x.right = y
    fix(y)
    fix(x)
    return x


def rotate_left(x):
    y = x.right
    x.right = y.left
    y.left = x
    fix(x)
    fix(y)
    return y


def avl_insert(node, key):
    if node is None:
        return Node(key)
    if key < node.key:
        node.left = avl_insert(node.left, key)
    elif key > node.key:
        node.right = avl_insert(node.right, key)
    else:
        return node
    fix(node)
    b = balance(node)
    if b > 1 and key < node.left.key:
        return rotate_right(node)
    if b < -1 and key > node.right.key:
        return rotate_left(node)
    if b > 1:
        node.left = rotate_left(node.left)
        return rotate_right(node)
    if b < -1:
        node.right = rotate_right(node.right)
        return rotate_left(node)
    return node`,
    `class Node {
    int key, height = 1;
    Node left, right;
    Node(int k) { key = k; }
}

class Avl {
    static int h(Node n) { return n == null ? 0 : n.height; }
    static int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }
    static void fix(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }

    static Node rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        x.right = y;
        fix(y); fix(x);
        return x;
    }

    static Node rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        fix(x); fix(y);
        return y;
    }

    static Node insert(Node n, int key) {
        if (n == null) return new Node(key);
        if (key < n.key) n.left = insert(n.left, key);
        else if (key > n.key) n.right = insert(n.right, key);
        else return n;
        fix(n);
        int b = bf(n);
        if (b > 1 && key < n.left.key) return rotateRight(n);
        if (b < -1 && key > n.right.key) return rotateLeft(n);
        if (b > 1) { n.left = rotateLeft(n.left); return rotateRight(n); }
        if (b < -1) { n.right = rotateRight(n.right); return rotateLeft(n); }
        return n;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

const h = (n) => (n ? n.height : 0);
const bf = (n) => (n ? h(n.left) - h(n.right) : 0);
const fix = (n) => {
  n.height = 1 + Math.max(h(n.left), h(n.right));
};

function rotateRight(y) {
  const x = y.left;
  y.left = x.right;
  x.right = y;
  fix(y);
  fix(x);
  return x;
}

function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  y.left = x;
  fix(x);
  fix(y);
  return y;
}

function avlInsert(node, key) {
  if (!node) return new Node(key);
  if (key < node.key) node.left = avlInsert(node.left, key);
  else if (key > node.key) node.right = avlInsert(node.right, key);
  else return node;
  fix(node);
  const b = bf(node);
  if (b > 1 && key < node.left.key) return rotateRight(node);
  if (b < -1 && key > node.right.key) return rotateLeft(node);
  if (b > 1) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (b < -1) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  return node;
}`,
    `class Node {
    public int Key;
    public int Height = 1;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class Avl {
    static int H(Node? n) => n?.Height ?? 0;
    static int Bf(Node? n) => n == null ? 0 : H(n.Left) - H(n.Right);
    static void Fix(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));

    public static Node RotateRight(Node y) {
        Node x = y.Left!;
        y.Left = x.Right;
        x.Right = y;
        Fix(y); Fix(x);
        return x;
    }

    public static Node RotateLeft(Node x) {
        Node y = x.Right!;
        x.Right = y.Left;
        y.Left = x;
        Fix(x); Fix(y);
        return y;
    }

    public static Node Insert(Node? n, int key) {
        if (n == null) return new Node(key);
        if (key < n.Key) n.Left = Insert(n.Left, key);
        else if (key > n.Key) n.Right = Insert(n.Right, key);
        else return n;
        Fix(n);
        int b = Bf(n);
        if (b > 1 && key < n.Left!.Key) return RotateRight(n);
        if (b < -1 && key > n.Right!.Key) return RotateLeft(n);
        if (b > 1) { n.Left = RotateLeft(n.Left!); return RotateRight(n); }
        if (b < -1) { n.Right = RotateRight(n.Right!); return RotateLeft(n); }
        return n;
    }
}`,
  ),

  "avl-delete": snippets(
    `typedef struct Node { int key, height; struct Node *left, *right; } Node;

static int h(Node* n) { return n ? n->height : 0; }
static int max2(int a, int b) { return a > b ? a : b; }
static int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }
static void fix(Node* n) { n->height = 1 + max2(h(n->left), h(n->right)); }

Node* rotate_right(Node* y) {
    Node* x = y->left;
    y->left = x->right; x->right = y;
    fix(y); fix(x);
    return x;
}

Node* rotate_left(Node* x) {
    Node* y = x->right;
    x->right = y->left; y->left = x;
    fix(x); fix(y);
    return y;
}

Node* rebalance(Node* n) {
    fix(n);
    int b = bf(n);
    if (b > 1) {
        if (bf(n->left) < 0) n->left = rotate_left(n->left);
        return rotate_right(n);
    }
    if (b < -1) {
        if (bf(n->right) > 0) n->right = rotate_right(n->right);
        return rotate_left(n);
    }
    return n;
}

Node* avl_delete(Node* n, int key) {
    if (!n) return NULL;
    if (key < n->key) n->left = avl_delete(n->left, key);
    else if (key > n->key) n->right = avl_delete(n->right, key);
    else {
        if (!n->left || !n->right) {
            Node* child = n->left ? n->left : n->right;
            free(n);
            return child;
        }
        Node* succ = n->right;
        while (succ->left) succ = succ->left;
        n->key = succ->key;
        n->right = avl_delete(n->right, succ->key);
    }
    return rebalance(n);
}`,
    `struct Node {
    int key, height = 1;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int h(Node* n) { return n ? n->height : 0; }
int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }
void fix(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }

Node* rotate_right(Node* y) {
    Node* x = y->left;
    y->left = x->right; x->right = y;
    fix(y); fix(x);
    return x;
}

Node* rotate_left(Node* x) {
    Node* y = x->right;
    x->right = y->left; y->left = x;
    fix(x); fix(y);
    return y;
}

Node* rebalance(Node* n) {
    fix(n);
    if (bf(n) > 1) {
        if (bf(n->left) < 0) n->left = rotate_left(n->left);
        return rotate_right(n);
    }
    if (bf(n) < -1) {
        if (bf(n->right) > 0) n->right = rotate_right(n->right);
        return rotate_left(n);
    }
    return n;
}

Node* avl_delete(Node* n, int key) {
    if (!n) return nullptr;
    if (key < n->key) n->left = avl_delete(n->left, key);
    else if (key > n->key) n->right = avl_delete(n->right, key);
    else {
        if (!n->left || !n->right) {
            Node* child = n->left ? n->left : n->right;
            delete n;
            return child;
        }
        Node* succ = n->right;
        while (succ->left) succ = succ->left;
        n->key = succ->key;
        n->right = avl_delete(n->right, succ->key);
    }
    return rebalance(n);
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None


def height(node):
    return node.height if node else 0


def balance(node):
    return height(node.left) - height(node.right) if node else 0


def fix(node):
    node.height = 1 + max(height(node.left), height(node.right))


def rotate_right(y):
    x = y.left
    y.left = x.right
    x.right = y
    fix(y)
    fix(x)
    return x


def rotate_left(x):
    y = x.right
    x.right = y.left
    y.left = x
    fix(x)
    fix(y)
    return y


def rebalance(node):
    fix(node)
    if balance(node) > 1:
        if balance(node.left) < 0:
            node.left = rotate_left(node.left)
        return rotate_right(node)
    if balance(node) < -1:
        if balance(node.right) > 0:
            node.right = rotate_right(node.right)
        return rotate_left(node)
    return node


def avl_delete(node, key):
    if node is None:
        return None
    if key < node.key:
        node.left = avl_delete(node.left, key)
    elif key > node.key:
        node.right = avl_delete(node.right, key)
    else:
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left
        succ = node.right
        while succ.left:
            succ = succ.left
        node.key = succ.key
        node.right = avl_delete(node.right, succ.key)
    return rebalance(node)`,
    `class Node {
    int key, height = 1;
    Node left, right;
    Node(int k) { key = k; }
}

class AvlDelete {
    static int h(Node n) { return n == null ? 0 : n.height; }
    static int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }
    static void fix(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }

    static Node rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right; x.right = y;
        fix(y); fix(x);
        return x;
    }

    static Node rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left; y.left = x;
        fix(x); fix(y);
        return y;
    }

    static Node rebalance(Node n) {
        fix(n);
        if (bf(n) > 1) {
            if (bf(n.left) < 0) n.left = rotateLeft(n.left);
            return rotateRight(n);
        }
        if (bf(n) < -1) {
            if (bf(n.right) > 0) n.right = rotateRight(n.right);
            return rotateLeft(n);
        }
        return n;
    }

    static Node delete(Node n, int key) {
        if (n == null) return null;
        if (key < n.key) n.left = delete(n.left, key);
        else if (key > n.key) n.right = delete(n.right, key);
        else {
            if (n.left == null) return n.right;
            if (n.right == null) return n.left;
            Node succ = n.right;
            while (succ.left != null) succ = succ.left;
            n.key = succ.key;
            n.right = delete(n.right, succ.key);
        }
        return rebalance(n);
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

const h = (n) => (n ? n.height : 0);
const bf = (n) => (n ? h(n.left) - h(n.right) : 0);
const fix = (n) => {
  n.height = 1 + Math.max(h(n.left), h(n.right));
};

function rotateRight(y) {
  const x = y.left;
  y.left = x.right;
  x.right = y;
  fix(y);
  fix(x);
  return x;
}

function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  y.left = x;
  fix(x);
  fix(y);
  return y;
}

function rebalance(node) {
  fix(node);
  if (bf(node) > 1) {
    if (bf(node.left) < 0) node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (bf(node) < -1) {
    if (bf(node.right) > 0) node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  return node;
}

function avlDelete(node, key) {
  if (!node) return null;
  if (key < node.key) node.left = avlDelete(node.left, key);
  else if (key > node.key) node.right = avlDelete(node.right, key);
  else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    let succ = node.right;
    while (succ.left) succ = succ.left;
    node.key = succ.key;
    node.right = avlDelete(node.right, succ.key);
  }
  return rebalance(node);
}`,
    `class Node {
    public int Key;
    public int Height = 1;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class AvlDelete {
    static int H(Node? n) => n?.Height ?? 0;
    static int Bf(Node? n) => n == null ? 0 : H(n.Left) - H(n.Right);
    static void Fix(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));

    static Node RotateRight(Node y) {
        Node x = y.Left!;
        y.Left = x.Right; x.Right = y;
        Fix(y); Fix(x);
        return x;
    }

    static Node RotateLeft(Node x) {
        Node y = x.Right!;
        x.Right = y.Left; y.Left = x;
        Fix(x); Fix(y);
        return y;
    }

    static Node Rebalance(Node n) {
        Fix(n);
        if (Bf(n) > 1) {
            if (Bf(n.Left) < 0) n.Left = RotateLeft(n.Left!);
            return RotateRight(n);
        }
        if (Bf(n) < -1) {
            if (Bf(n.Right) > 0) n.Right = RotateRight(n.Right!);
            return RotateLeft(n);
        }
        return n;
    }

    public static Node? Delete(Node? n, int key) {
        if (n == null) return null;
        if (key < n.Key) n.Left = Delete(n.Left, key);
        else if (key > n.Key) n.Right = Delete(n.Right, key);
        else {
            if (n.Left == null) return n.Right;
            if (n.Right == null) return n.Left;
            Node succ = n.Right;
            while (succ.Left != null) succ = succ.Left;
            n.Key = succ.Key;
            n.Right = Delete(n.Right, succ.Key);
        }
        return Rebalance(n);
    }
}`,
  ),

  "avl-ll": snippets(
    `typedef struct Node { int key, height; struct Node *left, *right; } Node;

static int h(Node* n) { return n ? n->height : 0; }
static int max2(int a, int b) { return a > b ? a : b; }
static void fix(Node* n) { n->height = 1 + max2(h(n->left), h(n->right)); }
static int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

/* LL case: left child is left-heavy -> one right rotation */
Node* rotate_right(Node* z) {
    Node* y = z->left;
    Node* t = y->right;
    y->right = z;
    z->left = t;
    fix(z); fix(y);
    return y;
}

int is_ll_case(Node* z) {
    return bf(z) > 1 && bf(z->left) >= 0;
}

Node* fix_ll(Node* z) {
    if (is_ll_case(z)) return rotate_right(z);
    fix(z);
    return z;
}`,
    `struct Node {
    int key, height = 1;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int h(Node* n) { return n ? n->height : 0; }
void fix(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }
int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

// LL case: z is left-heavy and its left child leans left
Node* rotate_right(Node* z) {
    Node* y = z->left;
    z->left = y->right;
    y->right = z;
    fix(z); fix(y);
    return y;
}

bool is_ll_case(Node* z) { return bf(z) > 1 && bf(z->left) >= 0; }

Node* fix_ll(Node* z) {
    if (is_ll_case(z)) return rotate_right(z);
    fix(z);
    return z;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None


def height(node):
    return node.height if node else 0


def fix(node):
    node.height = 1 + max(height(node.left), height(node.right))


def balance(node):
    return height(node.left) - height(node.right) if node else 0


def rotate_right(z):
    """LL case: single right rotation around z."""
    y = z.left
    z.left = y.right
    y.right = z
    fix(z)
    fix(y)
    return y


def is_ll_case(z):
    return balance(z) > 1 and balance(z.left) >= 0


def fix_ll(z):
    if is_ll_case(z):
        return rotate_right(z)
    fix(z)
    return z`,
    `class Node {
    int key, height = 1;
    Node left, right;
    Node(int k) { key = k; }
}

class AvlLL {
    static int h(Node n) { return n == null ? 0 : n.height; }
    static void fix(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }
    static int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }

    // LL: left subtree of the left child is too tall -> rotate right
    static Node rotateRight(Node z) {
        Node y = z.left;
        z.left = y.right;
        y.right = z;
        fix(z); fix(y);
        return y;
    }

    static boolean isLL(Node z) { return bf(z) > 1 && bf(z.left) >= 0; }

    static Node fixLL(Node z) {
        if (isLL(z)) return rotateRight(z);
        fix(z);
        return z;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

const h = (n) => (n ? n.height : 0);
const bf = (n) => (n ? h(n.left) - h(n.right) : 0);
const fix = (n) => {
  n.height = 1 + Math.max(h(n.left), h(n.right));
};

// LL case: single right rotation restores the AVL invariant
function rotateRight(z) {
  const y = z.left;
  z.left = y.right;
  y.right = z;
  fix(z);
  fix(y);
  return y;
}

function isLLCase(z) {
  return bf(z) > 1 && bf(z.left) >= 0;
}

function fixLL(z) {
  if (isLLCase(z)) return rotateRight(z);
  fix(z);
  return z;
}`,
    `class Node {
    public int Key;
    public int Height = 1;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class AvlLL {
    static int H(Node? n) => n?.Height ?? 0;
    static void Fix(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));
    static int Bf(Node? n) => n == null ? 0 : H(n.Left) - H(n.Right);

    // LL case: rotate right around the unbalanced node
    public static Node RotateRight(Node z) {
        Node y = z.Left!;
        z.Left = y.Right;
        y.Right = z;
        Fix(z); Fix(y);
        return y;
    }

    public static bool IsLLCase(Node z) => Bf(z) > 1 && Bf(z.Left) >= 0;

    public static Node FixLL(Node z) {
        if (IsLLCase(z)) return RotateRight(z);
        Fix(z);
        return z;
    }
}`,
  ),

  "avl-rr": snippets(
    `typedef struct Node { int key, height; struct Node *left, *right; } Node;

static int h(Node* n) { return n ? n->height : 0; }
static int max2(int a, int b) { return a > b ? a : b; }
static void fix(Node* n) { n->height = 1 + max2(h(n->left), h(n->right)); }
static int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

/* RR case: right child is right-heavy -> one left rotation */
Node* rotate_left(Node* z) {
    Node* y = z->right;
    Node* t = y->left;
    y->left = z;
    z->right = t;
    fix(z); fix(y);
    return y;
}

int is_rr_case(Node* z) {
    return bf(z) < -1 && bf(z->right) <= 0;
}

Node* fix_rr(Node* z) {
    if (is_rr_case(z)) return rotate_left(z);
    fix(z);
    return z;
}`,
    `struct Node {
    int key, height = 1;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int h(Node* n) { return n ? n->height : 0; }
void fix(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }
int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

// RR case: z is right-heavy and its right child leans right
Node* rotate_left(Node* z) {
    Node* y = z->right;
    z->right = y->left;
    y->left = z;
    fix(z); fix(y);
    return y;
}

bool is_rr_case(Node* z) { return bf(z) < -1 && bf(z->right) <= 0; }

Node* fix_rr(Node* z) {
    if (is_rr_case(z)) return rotate_left(z);
    fix(z);
    return z;
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None


def height(node):
    return node.height if node else 0


def fix(node):
    node.height = 1 + max(height(node.left), height(node.right))


def balance(node):
    return height(node.left) - height(node.right) if node else 0


def rotate_left(z):
    """RR case: single left rotation around z."""
    y = z.right
    z.right = y.left
    y.left = z
    fix(z)
    fix(y)
    return y


def is_rr_case(z):
    return balance(z) < -1 and balance(z.right) <= 0


def fix_rr(z):
    if is_rr_case(z):
        return rotate_left(z)
    fix(z)
    return z`,
    `class Node {
    int key, height = 1;
    Node left, right;
    Node(int k) { key = k; }
}

class AvlRR {
    static int h(Node n) { return n == null ? 0 : n.height; }
    static void fix(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }
    static int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }

    // RR: right subtree of the right child is too tall -> rotate left
    static Node rotateLeft(Node z) {
        Node y = z.right;
        z.right = y.left;
        y.left = z;
        fix(z); fix(y);
        return y;
    }

    static boolean isRR(Node z) { return bf(z) < -1 && bf(z.right) <= 0; }

    static Node fixRR(Node z) {
        if (isRR(z)) return rotateLeft(z);
        fix(z);
        return z;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

const h = (n) => (n ? n.height : 0);
const bf = (n) => (n ? h(n.left) - h(n.right) : 0);
const fix = (n) => {
  n.height = 1 + Math.max(h(n.left), h(n.right));
};

// RR case: single left rotation restores the AVL invariant
function rotateLeft(z) {
  const y = z.right;
  z.right = y.left;
  y.left = z;
  fix(z);
  fix(y);
  return y;
}

function isRRCase(z) {
  return bf(z) < -1 && bf(z.right) <= 0;
}

function fixRR(z) {
  if (isRRCase(z)) return rotateLeft(z);
  fix(z);
  return z;
}`,
    `class Node {
    public int Key;
    public int Height = 1;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class AvlRR {
    static int H(Node? n) => n?.Height ?? 0;
    static void Fix(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));
    static int Bf(Node? n) => n == null ? 0 : H(n.Left) - H(n.Right);

    // RR case: rotate left around the unbalanced node
    public static Node RotateLeft(Node z) {
        Node y = z.Right!;
        z.Right = y.Left;
        y.Left = z;
        Fix(z); Fix(y);
        return y;
    }

    public static bool IsRRCase(Node z) => Bf(z) < -1 && Bf(z.Right) <= 0;

    public static Node FixRR(Node z) {
        if (IsRRCase(z)) return RotateLeft(z);
        Fix(z);
        return z;
    }
}`,
  ),

  "avl-lr": snippets(
    `typedef struct Node { int key, height; struct Node *left, *right; } Node;

static int h(Node* n) { return n ? n->height : 0; }
static int max2(int a, int b) { return a > b ? a : b; }
static void fix(Node* n) { n->height = 1 + max2(h(n->left), h(n->right)); }
static int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

Node* rotate_left(Node* z) {
    Node* y = z->right;
    z->right = y->left; y->left = z;
    fix(z); fix(y);
    return y;
}

Node* rotate_right(Node* z) {
    Node* y = z->left;
    z->left = y->right; y->right = z;
    fix(z); fix(y);
    return y;
}

int is_lr_case(Node* z) {
    return bf(z) > 1 && bf(z->left) < 0;
}

/* LR: rotate the left child left, then rotate z right */
Node* fix_lr(Node* z) {
    if (!is_lr_case(z)) { fix(z); return z; }
    z->left = rotate_left(z->left);
    return rotate_right(z);
}`,
    `struct Node {
    int key, height = 1;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int h(Node* n) { return n ? n->height : 0; }
void fix(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }
int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

Node* rotate_left(Node* z) {
    Node* y = z->right;
    z->right = y->left; y->left = z;
    fix(z); fix(y);
    return y;
}

Node* rotate_right(Node* z) {
    Node* y = z->left;
    z->left = y->right; y->right = z;
    fix(z); fix(y);
    return y;
}

bool is_lr_case(Node* z) { return bf(z) > 1 && bf(z->left) < 0; }

// LR: left child leans right -> rotate left, then rotate right
Node* fix_lr(Node* z) {
    if (!is_lr_case(z)) { fix(z); return z; }
    z->left = rotate_left(z->left);
    return rotate_right(z);
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None


def height(node):
    return node.height if node else 0


def fix(node):
    node.height = 1 + max(height(node.left), height(node.right))


def balance(node):
    return height(node.left) - height(node.right) if node else 0


def rotate_left(z):
    y = z.right
    z.right = y.left
    y.left = z
    fix(z)
    fix(y)
    return y


def rotate_right(z):
    y = z.left
    z.left = y.right
    y.right = z
    fix(z)
    fix(y)
    return y


def is_lr_case(z):
    return balance(z) > 1 and balance(z.left) < 0


def fix_lr(z):
    """LR: rotate the left child left, then rotate z right."""
    if not is_lr_case(z):
        fix(z)
        return z
    z.left = rotate_left(z.left)
    return rotate_right(z)`,
    `class Node {
    int key, height = 1;
    Node left, right;
    Node(int k) { key = k; }
}

class AvlLR {
    static int h(Node n) { return n == null ? 0 : n.height; }
    static void fix(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }
    static int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }

    static Node rotateLeft(Node z) {
        Node y = z.right;
        z.right = y.left; y.left = z;
        fix(z); fix(y);
        return y;
    }

    static Node rotateRight(Node z) {
        Node y = z.left;
        z.left = y.right; y.right = z;
        fix(z); fix(y);
        return y;
    }

    static boolean isLR(Node z) { return bf(z) > 1 && bf(z.left) < 0; }

    // LR: double rotation (left on child, right on z)
    static Node fixLR(Node z) {
        if (!isLR(z)) { fix(z); return z; }
        z.left = rotateLeft(z.left);
        return rotateRight(z);
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

const h = (n) => (n ? n.height : 0);
const bf = (n) => (n ? h(n.left) - h(n.right) : 0);
const fix = (n) => {
  n.height = 1 + Math.max(h(n.left), h(n.right));
};

function rotateLeft(z) {
  const y = z.right;
  z.right = y.left;
  y.left = z;
  fix(z);
  fix(y);
  return y;
}

function rotateRight(z) {
  const y = z.left;
  z.left = y.right;
  y.right = z;
  fix(z);
  fix(y);
  return y;
}

function isLRCase(z) {
  return bf(z) > 1 && bf(z.left) < 0;
}

// LR: rotate the left child left, then rotate z right
function fixLR(z) {
  if (!isLRCase(z)) {
    fix(z);
    return z;
  }
  z.left = rotateLeft(z.left);
  return rotateRight(z);
}`,
    `class Node {
    public int Key;
    public int Height = 1;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class AvlLR {
    static int H(Node? n) => n?.Height ?? 0;
    static void Fix(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));
    static int Bf(Node? n) => n == null ? 0 : H(n.Left) - H(n.Right);

    public static Node RotateLeft(Node z) {
        Node y = z.Right!;
        z.Right = y.Left; y.Left = z;
        Fix(z); Fix(y);
        return y;
    }

    public static Node RotateRight(Node z) {
        Node y = z.Left!;
        z.Left = y.Right; y.Right = z;
        Fix(z); Fix(y);
        return y;
    }

    public static bool IsLRCase(Node z) => Bf(z) > 1 && Bf(z.Left) < 0;

    // LR: double rotation (left on child, right on z)
    public static Node FixLR(Node z) {
        if (!IsLRCase(z)) { Fix(z); return z; }
        z.Left = RotateLeft(z.Left!);
        return RotateRight(z);
    }
}`,
  ),

  "avl-rl": snippets(
    `typedef struct Node { int key, height; struct Node *left, *right; } Node;

static int h(Node* n) { return n ? n->height : 0; }
static int max2(int a, int b) { return a > b ? a : b; }
static void fix(Node* n) { n->height = 1 + max2(h(n->left), h(n->right)); }
static int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

Node* rotate_left(Node* z) {
    Node* y = z->right;
    z->right = y->left; y->left = z;
    fix(z); fix(y);
    return y;
}

Node* rotate_right(Node* z) {
    Node* y = z->left;
    z->left = y->right; y->right = z;
    fix(z); fix(y);
    return y;
}

int is_rl_case(Node* z) {
    return bf(z) < -1 && bf(z->right) > 0;
}

/* RL: rotate the right child right, then rotate z left */
Node* fix_rl(Node* z) {
    if (!is_rl_case(z)) { fix(z); return z; }
    z->right = rotate_right(z->right);
    return rotate_left(z);
}`,
    `struct Node {
    int key, height = 1;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

int h(Node* n) { return n ? n->height : 0; }
void fix(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }
int bf(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

Node* rotate_left(Node* z) {
    Node* y = z->right;
    z->right = y->left; y->left = z;
    fix(z); fix(y);
    return y;
}

Node* rotate_right(Node* z) {
    Node* y = z->left;
    z->left = y->right; y->right = z;
    fix(z); fix(y);
    return y;
}

bool is_rl_case(Node* z) { return bf(z) < -1 && bf(z->right) > 0; }

// RL: right child leans left -> rotate right, then rotate left
Node* fix_rl(Node* z) {
    if (!is_rl_case(z)) { fix(z); return z; }
    z->right = rotate_right(z->right);
    return rotate_left(z);
}`,
    `class Node:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None


def height(node):
    return node.height if node else 0


def fix(node):
    node.height = 1 + max(height(node.left), height(node.right))


def balance(node):
    return height(node.left) - height(node.right) if node else 0


def rotate_left(z):
    y = z.right
    z.right = y.left
    y.left = z
    fix(z)
    fix(y)
    return y


def rotate_right(z):
    y = z.left
    z.left = y.right
    y.right = z
    fix(z)
    fix(y)
    return y


def is_rl_case(z):
    return balance(z) < -1 and balance(z.right) > 0


def fix_rl(z):
    """RL: rotate the right child right, then rotate z left."""
    if not is_rl_case(z):
        fix(z)
        return z
    z.right = rotate_right(z.right)
    return rotate_left(z)`,
    `class Node {
    int key, height = 1;
    Node left, right;
    Node(int k) { key = k; }
}

class AvlRL {
    static int h(Node n) { return n == null ? 0 : n.height; }
    static void fix(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }
    static int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }

    static Node rotateLeft(Node z) {
        Node y = z.right;
        z.right = y.left; y.left = z;
        fix(z); fix(y);
        return y;
    }

    static Node rotateRight(Node z) {
        Node y = z.left;
        z.left = y.right; y.right = z;
        fix(z); fix(y);
        return y;
    }

    static boolean isRL(Node z) { return bf(z) < -1 && bf(z.right) > 0; }

    // RL: double rotation (right on child, left on z)
    static Node fixRL(Node z) {
        if (!isRL(z)) { fix(z); return z; }
        z.right = rotateRight(z.right);
        return rotateLeft(z);
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

const h = (n) => (n ? n.height : 0);
const bf = (n) => (n ? h(n.left) - h(n.right) : 0);
const fix = (n) => {
  n.height = 1 + Math.max(h(n.left), h(n.right));
};

function rotateLeft(z) {
  const y = z.right;
  z.right = y.left;
  y.left = z;
  fix(z);
  fix(y);
  return y;
}

function rotateRight(z) {
  const y = z.left;
  z.left = y.right;
  y.right = z;
  fix(z);
  fix(y);
  return y;
}

function isRLCase(z) {
  return bf(z) < -1 && bf(z.right) > 0;
}

// RL: rotate the right child right, then rotate z left
function fixRL(z) {
  if (!isRLCase(z)) {
    fix(z);
    return z;
  }
  z.right = rotateRight(z.right);
  return rotateLeft(z);
}`,
    `class Node {
    public int Key;
    public int Height = 1;
    public Node? Left, Right;
    public Node(int key) { Key = key; }
}

static class AvlRL {
    static int H(Node? n) => n?.Height ?? 0;
    static void Fix(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));
    static int Bf(Node? n) => n == null ? 0 : H(n.Left) - H(n.Right);

    public static Node RotateLeft(Node z) {
        Node y = z.Right!;
        z.Right = y.Left; y.Left = z;
        Fix(z); Fix(y);
        return y;
    }

    public static Node RotateRight(Node z) {
        Node y = z.Left!;
        z.Left = y.Right; y.Right = z;
        Fix(z); Fix(y);
        return y;
    }

    public static bool IsRLCase(Node z) => Bf(z) < -1 && Bf(z.Right) > 0;

    // RL: double rotation (right on child, left on z)
    public static Node FixRL(Node z) {
        if (!IsRLCase(z)) { Fix(z); return z; }
        z.Right = RotateRight(z.Right!);
        return RotateLeft(z);
    }
}`,
  ),

  "rb-insert": snippets(
    `typedef enum { RED, BLACK } Color;
typedef struct Node {
    int key; Color color;
    struct Node *left, *right, *parent;
} Node;

Node* node_new(int key) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->key = key; n->color = RED;
    n->left = n->right = n->parent = NULL;
    return n;
}

void rotate_left(Node** root, Node* x) {
    Node* y = x->right;
    x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent) *root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x; x->parent = y;
}

void rotate_right(Node** root, Node* y) {
    Node* x = y->left;
    y->left = x->right;
    if (x->right) x->right->parent = y;
    x->parent = y->parent;
    if (!y->parent) *root = x;
    else if (y == y->parent->left) y->parent->left = x;
    else y->parent->right = x;
    x->right = y; y->parent = x;
}

void rb_insert(Node** root, int key) {
    Node* z = node_new(key);
    Node* y = NULL;
    for (Node* x = *root; x;) {
        y = x;
        if (key < x->key) x = x->left;
        else if (key > x->key) x = x->right;
        else { free(z); return; }
    }
    z->parent = y;
    if (!y) *root = z;
    else if (key < y->key) y->left = z;
    else y->right = z;

    while (z->parent && z->parent->color == RED) {
        Node* p = z->parent;
        Node* g = p->parent;
        if (p == g->left) {
            Node* u = g->right;
            if (u && u->color == RED) {
                p->color = BLACK; u->color = BLACK; g->color = RED;
                z = g;
            } else {
                if (z == p->right) { z = p; rotate_left(root, z); p = z->parent; }
                p->color = BLACK; g->color = RED;
                rotate_right(root, g);
            }
        } else {
            Node* u = g->left;
            if (u && u->color == RED) {
                p->color = BLACK; u->color = BLACK; g->color = RED;
                z = g;
            } else {
                if (z == p->left) { z = p; rotate_right(root, z); p = z->parent; }
                p->color = BLACK; g->color = RED;
                rotate_left(root, g);
            }
        }
    }
    (*root)->color = BLACK;
}`,
    `enum Color { RED, BLACK };

struct Node {
    int key;
    Color color = RED;
    Node *left = nullptr, *right = nullptr, *parent = nullptr;
    explicit Node(int k) : key(k) {}
};

struct RedBlackTree {
    Node* root = nullptr;

    void rotate_left(Node* x) {
        Node* y = x->right;
        x->right = y->left;
        if (y->left) y->left->parent = x;
        y->parent = x->parent;
        if (!x->parent) root = y;
        else if (x == x->parent->left) x->parent->left = y;
        else x->parent->right = y;
        y->left = x; x->parent = y;
    }

    void rotate_right(Node* y) {
        Node* x = y->left;
        y->left = x->right;
        if (x->right) x->right->parent = y;
        x->parent = y->parent;
        if (!y->parent) root = x;
        else if (y == y->parent->left) y->parent->left = x;
        else y->parent->right = x;
        x->right = y; y->parent = x;
    }

    void insert(int key) {
        Node* y = nullptr;
        for (Node* x = root; x;) {
            y = x;
            if (key < x->key) x = x->left;
            else if (key > x->key) x = x->right;
            else return;
        }
        Node* z = new Node(key);
        z->parent = y;
        if (!y) root = z;
        else if (key < y->key) y->left = z;
        else y->right = z;
        fixup(z);
    }

    void fixup(Node* z) {
        while (z->parent && z->parent->color == RED) {
            Node* p = z->parent;
            Node* g = p->parent;
            if (p == g->left) {
                Node* u = g->right;
                if (u && u->color == RED) {
                    p->color = u->color = BLACK; g->color = RED; z = g;
                } else {
                    if (z == p->right) { z = p; rotate_left(z); p = z->parent; }
                    p->color = BLACK; g->color = RED; rotate_right(g);
                }
            } else {
                Node* u = g->left;
                if (u && u->color == RED) {
                    p->color = u->color = BLACK; g->color = RED; z = g;
                } else {
                    if (z == p->left) { z = p; rotate_right(z); p = z->parent; }
                    p->color = BLACK; g->color = RED; rotate_left(g);
                }
            }
        }
        root->color = BLACK;
    }
};`,
    `RED, BLACK = "red", "black"


class Node:
    def __init__(self, key):
        self.key = key
        self.color = RED
        self.left = None
        self.right = None
        self.parent = None


class RedBlackTree:
    def __init__(self):
        self.root = None

    def rotate_left(self, x):
        y = x.right
        x.right = y.left
        if y.left:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x is x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def rotate_right(self, y):
        x = y.left
        y.left = x.right
        if x.right:
            x.right.parent = y
        x.parent = y.parent
        if y.parent is None:
            self.root = x
        elif y is y.parent.left:
            y.parent.left = x
        else:
            y.parent.right = x
        x.right = y
        y.parent = x

    def insert(self, key):
        parent, cur = None, self.root
        while cur:
            parent = cur
            if key < cur.key:
                cur = cur.left
            elif key > cur.key:
                cur = cur.right
            else:
                return
        z = Node(key)
        z.parent = parent
        if parent is None:
            self.root = z
        elif key < parent.key:
            parent.left = z
        else:
            parent.right = z
        self.fixup(z)

    def fixup(self, z):
        while z.parent and z.parent.color == RED:
            p, g = z.parent, z.parent.parent
            if p is g.left:
                uncle = g.right
                if uncle and uncle.color == RED:
                    p.color = uncle.color = BLACK
                    g.color = RED
                    z = g
                else:
                    if z is p.right:
                        z = p
                        self.rotate_left(z)
                        p = z.parent
                    p.color, g.color = BLACK, RED
                    self.rotate_right(g)
            else:
                uncle = g.left
                if uncle and uncle.color == RED:
                    p.color = uncle.color = BLACK
                    g.color = RED
                    z = g
                else:
                    if z is p.left:
                        z = p
                        self.rotate_right(z)
                        p = z.parent
                    p.color, g.color = BLACK, RED
                    self.rotate_left(g)
        self.root.color = BLACK`,
    `class Node {
    int key;
    boolean red = true;
    Node left, right, parent;
    Node(int k) { key = k; }
}

class RedBlackTree {
    Node root;

    void rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left;
        if (y.left != null) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent == null) root = y;
        else if (x == x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x; x.parent = y;
    }

    void rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        if (x.right != null) x.right.parent = y;
        x.parent = y.parent;
        if (y.parent == null) root = x;
        else if (y == y.parent.left) y.parent.left = x;
        else y.parent.right = x;
        x.right = y; y.parent = x;
    }

    void insert(int key) {
        Node parent = null, cur = root;
        while (cur != null) {
            parent = cur;
            if (key < cur.key) cur = cur.left;
            else if (key > cur.key) cur = cur.right;
            else return;
        }
        Node z = new Node(key);
        z.parent = parent;
        if (parent == null) root = z;
        else if (key < parent.key) parent.left = z;
        else parent.right = z;
        fixup(z);
    }

    void fixup(Node z) {
        while (z.parent != null && z.parent.red) {
            Node p = z.parent, g = p.parent;
            if (p == g.left) {
                Node u = g.right;
                if (u != null && u.red) {
                    p.red = false; u.red = false; g.red = true; z = g;
                } else {
                    if (z == p.right) { z = p; rotateLeft(z); p = z.parent; }
                    p.red = false; g.red = true; rotateRight(g);
                }
            } else {
                Node u = g.left;
                if (u != null && u.red) {
                    p.red = false; u.red = false; g.red = true; z = g;
                } else {
                    if (z == p.left) { z = p; rotateRight(z); p = z.parent; }
                    p.red = false; g.red = true; rotateLeft(g);
                }
            }
        }
        root.red = false;
    }
}`,
    `class Node {
  constructor(key) {
    this.key = key;
    this.red = true;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
  }

  rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;
    if (!y.parent) this.root = x;
    else if (y === y.parent.left) y.parent.left = x;
    else y.parent.right = x;
    x.right = y;
    y.parent = x;
  }

  insert(key) {
    let parent = null;
    let cur = this.root;
    while (cur) {
      parent = cur;
      if (key < cur.key) cur = cur.left;
      else if (key > cur.key) cur = cur.right;
      else return this;
    }
    const z = new Node(key);
    z.parent = parent;
    if (!parent) this.root = z;
    else if (key < parent.key) parent.left = z;
    else parent.right = z;
    this.fixup(z);
    return this;
  }

  fixup(node) {
    let z = node;
    while (z.parent && z.parent.red) {
      let p = z.parent;
      const g = p.parent;
      if (p === g.left) {
        const u = g.right;
        if (u && u.red) {
          p.red = false;
          u.red = false;
          g.red = true;
          z = g;
        } else {
          if (z === p.right) {
            z = p;
            this.rotateLeft(z);
            p = z.parent;
          }
          p.red = false;
          g.red = true;
          this.rotateRight(g);
        }
      } else {
        const u = g.left;
        if (u && u.red) {
          p.red = false;
          u.red = false;
          g.red = true;
          z = g;
        } else {
          if (z === p.left) {
            z = p;
            this.rotateRight(z);
            p = z.parent;
          }
          p.red = false;
          g.red = true;
          this.rotateLeft(g);
        }
      }
    }
    this.root.red = false;
  }
}`,
    `class Node {
    public int Key;
    public bool Red = true;
    public Node? Left, Right, Parent;
    public Node(int key) { Key = key; }
}

class RedBlackTree {
    public Node? Root { get; private set; }

    void RotateLeft(Node x) {
        Node y = x.Right!;
        x.Right = y.Left;
        if (y.Left != null) y.Left.Parent = x;
        y.Parent = x.Parent;
        if (x.Parent == null) Root = y;
        else if (x == x.Parent.Left) x.Parent.Left = y;
        else x.Parent.Right = y;
        y.Left = x; x.Parent = y;
    }

    void RotateRight(Node y) {
        Node x = y.Left!;
        y.Left = x.Right;
        if (x.Right != null) x.Right.Parent = y;
        x.Parent = y.Parent;
        if (y.Parent == null) Root = x;
        else if (y == y.Parent.Left) y.Parent.Left = x;
        else y.Parent.Right = x;
        x.Right = y; y.Parent = x;
    }

    public void Insert(int key) {
        Node? parent = null, cur = Root;
        while (cur != null) {
            parent = cur;
            if (key < cur.Key) cur = cur.Left;
            else if (key > cur.Key) cur = cur.Right;
            else return;
        }
        var z = new Node(key) { Parent = parent };
        if (parent == null) Root = z;
        else if (key < parent.Key) parent.Left = z;
        else parent.Right = z;
        Fixup(z);
    }

    void Fixup(Node z) {
        while (z.Parent != null && z.Parent.Red) {
            Node p = z.Parent, g = p.Parent!;
            if (p == g.Left) {
                Node? u = g.Right;
                if (u != null && u.Red) {
                    p.Red = false; u.Red = false; g.Red = true; z = g;
                } else {
                    if (z == p.Right) { z = p; RotateLeft(z); p = z.Parent!; }
                    p.Red = false; g.Red = true; RotateRight(g);
                }
            } else {
                Node? u = g.Left;
                if (u != null && u.Red) {
                    p.Red = false; u.Red = false; g.Red = true; z = g;
                } else {
                    if (z == p.Left) { z = p; RotateRight(z); p = z.Parent!; }
                    p.Red = false; g.Red = true; RotateLeft(g);
                }
            }
        }
        Root!.Red = false;
    }
}`,
  ),

  "rb-delete": snippets(
    `typedef enum { RED, BLACK } Color;
typedef struct Node {
    int key; Color color;
    struct Node *left, *right, *parent;
} Node;

static Node NIL_NODE = { 0, BLACK, NULL, NULL, NULL };
static Node* NIL = &NIL_NODE;

void rotate_left(Node** root, Node* x) {
    Node* y = x->right;
    x->right = y->left;
    if (y->left != NIL) y->left->parent = x;
    y->parent = x->parent;
    if (x->parent == NIL) *root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x; x->parent = y;
}

void rotate_right(Node** root, Node* y) {
    Node* x = y->left;
    y->left = x->right;
    if (x->right != NIL) x->right->parent = y;
    x->parent = y->parent;
    if (y->parent == NIL) *root = x;
    else if (y == y->parent->left) y->parent->left = x;
    else y->parent->right = x;
    x->right = y; y->parent = x;
}

void transplant(Node** root, Node* u, Node* v) {
    if (u->parent == NIL) *root = v;
    else if (u == u->parent->left) u->parent->left = v;
    else u->parent->right = v;
    v->parent = u->parent;
}

void delete_fixup(Node** root, Node* x) {
    while (x != *root && x->color == BLACK) {
        if (x == x->parent->left) {
            Node* w = x->parent->right;
            if (w->color == RED) {
                w->color = BLACK; x->parent->color = RED;
                rotate_left(root, x->parent);
                w = x->parent->right;
            }
            if (w->left->color == BLACK && w->right->color == BLACK) {
                w->color = RED; x = x->parent;
            } else {
                if (w->right->color == BLACK) {
                    w->left->color = BLACK; w->color = RED;
                    rotate_right(root, w);
                    w = x->parent->right;
                }
                w->color = x->parent->color;
                x->parent->color = BLACK; w->right->color = BLACK;
                rotate_left(root, x->parent);
                x = *root;
            }
        } else {
            Node* w = x->parent->left;
            if (w->color == RED) {
                w->color = BLACK; x->parent->color = RED;
                rotate_right(root, x->parent);
                w = x->parent->left;
            }
            if (w->right->color == BLACK && w->left->color == BLACK) {
                w->color = RED; x = x->parent;
            } else {
                if (w->left->color == BLACK) {
                    w->right->color = BLACK; w->color = RED;
                    rotate_left(root, w);
                    w = x->parent->left;
                }
                w->color = x->parent->color;
                x->parent->color = BLACK; w->left->color = BLACK;
                rotate_right(root, x->parent);
                x = *root;
            }
        }
    }
    x->color = BLACK;
}

void rb_delete(Node** root, Node* z) {
    Node* y = z;
    Node* x;
    Color removed = y->color;
    if (z->left == NIL) { x = z->right; transplant(root, z, z->right); }
    else if (z->right == NIL) { x = z->left; transplant(root, z, z->left); }
    else {
        y = z->right;
        while (y->left != NIL) y = y->left;
        removed = y->color;
        x = y->right;
        if (y->parent == z) {
            x->parent = y;
        } else {
            transplant(root, y, y->right);
            y->right = z->right; y->right->parent = y;
        }
        transplant(root, z, y);
        y->left = z->left; y->left->parent = y;
        y->color = z->color;
    }
    free(z);
    if (removed == BLACK) delete_fixup(root, x);
}`,
    `enum Color { RED, BLACK };

struct Node {
    int key;
    Color color = RED;
    Node *left, *right, *parent;
    explicit Node(int k) : key(k), left(nullptr), right(nullptr), parent(nullptr) {}
};

struct RedBlackTree {
    Node* nil;
    Node* root;

    RedBlackTree() {
        nil = new Node(0);
        nil->color = BLACK;
        nil->left = nil->right = nil->parent = nil;
        root = nil;
    }

    void rotate_left(Node* x) {
        Node* y = x->right;
        x->right = y->left;
        if (y->left != nil) y->left->parent = x;
        y->parent = x->parent;
        if (x->parent == nil) root = y;
        else if (x == x->parent->left) x->parent->left = y;
        else x->parent->right = y;
        y->left = x; x->parent = y;
    }

    void rotate_right(Node* y) {
        Node* x = y->left;
        y->left = x->right;
        if (x->right != nil) x->right->parent = y;
        x->parent = y->parent;
        if (y->parent == nil) root = x;
        else if (y == y->parent->left) y->parent->left = x;
        else y->parent->right = x;
        x->right = y; y->parent = x;
    }

    void transplant(Node* u, Node* v) {
        if (u->parent == nil) root = v;
        else if (u == u->parent->left) u->parent->left = v;
        else u->parent->right = v;
        v->parent = u->parent;
    }

    Node* minimum(Node* n) {
        while (n->left != nil) n = n->left;
        return n;
    }

    void erase(Node* z) {
        Node* y = z;
        Color removed = y->color;
        Node* x;
        if (z->left == nil) { x = z->right; transplant(z, z->right); }
        else if (z->right == nil) { x = z->left; transplant(z, z->left); }
        else {
            y = minimum(z->right);
            removed = y->color;
            x = y->right;
            if (y->parent == z) x->parent = y;
            else {
                transplant(y, y->right);
                y->right = z->right; y->right->parent = y;
            }
            transplant(z, y);
            y->left = z->left; y->left->parent = y;
            y->color = z->color;
        }
        delete z;
        if (removed == BLACK) fixup(x);
    }

    void fixup(Node* x) {
        while (x != root && x->color == BLACK) {
            if (x == x->parent->left) {
                Node* w = x->parent->right;
                if (w->color == RED) {
                    w->color = BLACK; x->parent->color = RED;
                    rotate_left(x->parent); w = x->parent->right;
                }
                if (w->left->color == BLACK && w->right->color == BLACK) {
                    w->color = RED; x = x->parent;
                } else {
                    if (w->right->color == BLACK) {
                        w->left->color = BLACK; w->color = RED;
                        rotate_right(w); w = x->parent->right;
                    }
                    w->color = x->parent->color;
                    x->parent->color = BLACK; w->right->color = BLACK;
                    rotate_left(x->parent);
                    x = root;
                }
            } else {
                Node* w = x->parent->left;
                if (w->color == RED) {
                    w->color = BLACK; x->parent->color = RED;
                    rotate_right(x->parent); w = x->parent->left;
                }
                if (w->right->color == BLACK && w->left->color == BLACK) {
                    w->color = RED; x = x->parent;
                } else {
                    if (w->left->color == BLACK) {
                        w->right->color = BLACK; w->color = RED;
                        rotate_left(w); w = x->parent->left;
                    }
                    w->color = x->parent->color;
                    x->parent->color = BLACK; w->left->color = BLACK;
                    rotate_right(x->parent);
                    x = root;
                }
            }
        }
        x->color = BLACK;
    }
};`,
    `RED, BLACK = "red", "black"


class Node:
    def __init__(self, key, color=RED):
        self.key = key
        self.color = color
        self.left = None
        self.right = None
        self.parent = None


class RedBlackTree:
    def __init__(self):
        self.nil = Node(None, BLACK)
        self.nil.left = self.nil.right = self.nil.parent = self.nil
        self.root = self.nil

    def rotate_left(self, x):
        y = x.right
        x.right = y.left
        if y.left is not self.nil:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is self.nil:
            self.root = y
        elif x is x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def rotate_right(self, y):
        x = y.left
        y.left = x.right
        if x.right is not self.nil:
            x.right.parent = y
        x.parent = y.parent
        if y.parent is self.nil:
            self.root = x
        elif y is y.parent.left:
            y.parent.left = x
        else:
            y.parent.right = x
        x.right = y
        y.parent = x

    def transplant(self, u, v):
        if u.parent is self.nil:
            self.root = v
        elif u is u.parent.left:
            u.parent.left = v
        else:
            u.parent.right = v
        v.parent = u.parent

    def minimum(self, node):
        while node.left is not self.nil:
            node = node.left
        return node

    def delete(self, z):
        y = z
        removed = y.color
        if z.left is self.nil:
            x = z.right
            self.transplant(z, z.right)
        elif z.right is self.nil:
            x = z.left
            self.transplant(z, z.left)
        else:
            y = self.minimum(z.right)
            removed = y.color
            x = y.right
            if y.parent is z:
                x.parent = y
            else:
                self.transplant(y, y.right)
                y.right = z.right
                y.right.parent = y
            self.transplant(z, y)
            y.left = z.left
            y.left.parent = y
            y.color = z.color
        if removed == BLACK:
            self.fixup(x)

    def fixup(self, x):
        while x is not self.root and x.color == BLACK:
            if x is x.parent.left:
                w = x.parent.right
                if w.color == RED:
                    w.color, x.parent.color = BLACK, RED
                    self.rotate_left(x.parent)
                    w = x.parent.right
                if w.left.color == BLACK and w.right.color == BLACK:
                    w.color = RED
                    x = x.parent
                else:
                    if w.right.color == BLACK:
                        w.left.color, w.color = BLACK, RED
                        self.rotate_right(w)
                        w = x.parent.right
                    w.color = x.parent.color
                    x.parent.color = BLACK
                    w.right.color = BLACK
                    self.rotate_left(x.parent)
                    x = self.root
            else:
                w = x.parent.left
                if w.color == RED:
                    w.color, x.parent.color = BLACK, RED
                    self.rotate_right(x.parent)
                    w = x.parent.left
                if w.right.color == BLACK and w.left.color == BLACK:
                    w.color = RED
                    x = x.parent
                else:
                    if w.left.color == BLACK:
                        w.right.color, w.color = BLACK, RED
                        self.rotate_left(w)
                        w = x.parent.left
                    w.color = x.parent.color
                    x.parent.color = BLACK
                    w.left.color = BLACK
                    self.rotate_right(x.parent)
                    x = self.root
        x.color = BLACK`,
    `class Node {
    int key;
    boolean red;
    Node left, right, parent;
    Node(int k, boolean red) { key = k; this.red = red; }
}

class RedBlackTree {
    final Node nil = new Node(0, false);
    Node root;

    RedBlackTree() {
        nil.left = nil.right = nil.parent = nil;
        root = nil;
    }

    void rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left;
        if (y.left != nil) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent == nil) root = y;
        else if (x == x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x; x.parent = y;
    }

    void rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        if (x.right != nil) x.right.parent = y;
        x.parent = y.parent;
        if (y.parent == nil) root = x;
        else if (y == y.parent.left) y.parent.left = x;
        else y.parent.right = x;
        x.right = y; y.parent = x;
    }

    void transplant(Node u, Node v) {
        if (u.parent == nil) root = v;
        else if (u == u.parent.left) u.parent.left = v;
        else u.parent.right = v;
        v.parent = u.parent;
    }

    Node minimum(Node n) {
        while (n.left != nil) n = n.left;
        return n;
    }

    void delete(Node z) {
        Node y = z, x;
        boolean removedRed = y.red;
        if (z.left == nil) { x = z.right; transplant(z, z.right); }
        else if (z.right == nil) { x = z.left; transplant(z, z.left); }
        else {
            y = minimum(z.right);
            removedRed = y.red;
            x = y.right;
            if (y.parent == z) x.parent = y;
            else {
                transplant(y, y.right);
                y.right = z.right; y.right.parent = y;
            }
            transplant(z, y);
            y.left = z.left; y.left.parent = y;
            y.red = z.red;
        }
        if (!removedRed) fixup(x);
    }

    void fixup(Node x) {
        while (x != root && !x.red) {
            if (x == x.parent.left) {
                Node w = x.parent.right;
                if (w.red) {
                    w.red = false; x.parent.red = true;
                    rotateLeft(x.parent); w = x.parent.right;
                }
                if (!w.left.red && !w.right.red) { w.red = true; x = x.parent; }
                else {
                    if (!w.right.red) {
                        w.left.red = false; w.red = true;
                        rotateRight(w); w = x.parent.right;
                    }
                    w.red = x.parent.red;
                    x.parent.red = false; w.right.red = false;
                    rotateLeft(x.parent);
                    x = root;
                }
            } else {
                Node w = x.parent.left;
                if (w.red) {
                    w.red = false; x.parent.red = true;
                    rotateRight(x.parent); w = x.parent.left;
                }
                if (!w.right.red && !w.left.red) { w.red = true; x = x.parent; }
                else {
                    if (!w.left.red) {
                        w.right.red = false; w.red = true;
                        rotateLeft(w); w = x.parent.left;
                    }
                    w.red = x.parent.red;
                    x.parent.red = false; w.left.red = false;
                    rotateRight(x.parent);
                    x = root;
                }
            }
        }
        x.red = false;
    }
}`,
    `class Node {
  constructor(key, red = true) {
    this.key = key;
    this.red = red;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.nil = new Node(null, false);
    this.nil.left = this.nil.right = this.nil.parent = this.nil;
    this.root = this.nil;
  }

  rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left !== this.nil) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === this.nil) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    if (x.right !== this.nil) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === this.nil) this.root = x;
    else if (y === y.parent.left) y.parent.left = x;
    else y.parent.right = x;
    x.right = y;
    y.parent = x;
  }

  transplant(u, v) {
    if (u.parent === this.nil) this.root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    v.parent = u.parent;
  }

  minimum(node) {
    let cur = node;
    while (cur.left !== this.nil) cur = cur.left;
    return cur;
  }

  delete(z) {
    let y = z;
    let x;
    let removedRed = y.red;
    if (z.left === this.nil) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (z.right === this.nil) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      removedRed = y.red;
      x = y.right;
      if (y.parent === z) x.parent = y;
      else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.red = z.red;
    }
    if (!removedRed) this.fixup(x);
  }

  fixup(node) {
    let x = node;
    while (x !== this.root && !x.red) {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.red) {
          w.red = false;
          x.parent.red = true;
          this.rotateLeft(x.parent);
          w = x.parent.right;
        }
        if (!w.left.red && !w.right.red) {
          w.red = true;
          x = x.parent;
        } else {
          if (!w.right.red) {
            w.left.red = false;
            w.red = true;
            this.rotateRight(w);
            w = x.parent.right;
          }
          w.red = x.parent.red;
          x.parent.red = false;
          w.right.red = false;
          this.rotateLeft(x.parent);
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        if (w.red) {
          w.red = false;
          x.parent.red = true;
          this.rotateRight(x.parent);
          w = x.parent.left;
        }
        if (!w.right.red && !w.left.red) {
          w.red = true;
          x = x.parent;
        } else {
          if (!w.left.red) {
            w.right.red = false;
            w.red = true;
            this.rotateLeft(w);
            w = x.parent.left;
          }
          w.red = x.parent.red;
          x.parent.red = false;
          w.left.red = false;
          this.rotateRight(x.parent);
          x = this.root;
        }
      }
    }
    x.red = false;
  }
}`,
    `class Node {
    public int Key;
    public bool Red;
    public Node Left = null!, Right = null!, Parent = null!;
    public Node(int key, bool red) { Key = key; Red = red; }
}

class RedBlackTree {
    readonly Node nil = new Node(0, false);
    Node root;

    public RedBlackTree() {
        nil.Left = nil.Right = nil.Parent = nil;
        root = nil;
    }

    void RotateLeft(Node x) {
        Node y = x.Right;
        x.Right = y.Left;
        if (y.Left != nil) y.Left.Parent = x;
        y.Parent = x.Parent;
        if (x.Parent == nil) root = y;
        else if (x == x.Parent.Left) x.Parent.Left = y;
        else x.Parent.Right = y;
        y.Left = x; x.Parent = y;
    }

    void RotateRight(Node y) {
        Node x = y.Left;
        y.Left = x.Right;
        if (x.Right != nil) x.Right.Parent = y;
        x.Parent = y.Parent;
        if (y.Parent == nil) root = x;
        else if (y == y.Parent.Left) y.Parent.Left = x;
        else y.Parent.Right = x;
        x.Right = y; y.Parent = x;
    }

    void Transplant(Node u, Node v) {
        if (u.Parent == nil) root = v;
        else if (u == u.Parent.Left) u.Parent.Left = v;
        else u.Parent.Right = v;
        v.Parent = u.Parent;
    }

    Node Minimum(Node n) {
        while (n.Left != nil) n = n.Left;
        return n;
    }

    public void Delete(Node z) {
        Node y = z, x;
        bool removedRed = y.Red;
        if (z.Left == nil) { x = z.Right; Transplant(z, z.Right); }
        else if (z.Right == nil) { x = z.Left; Transplant(z, z.Left); }
        else {
            y = Minimum(z.Right);
            removedRed = y.Red;
            x = y.Right;
            if (y.Parent == z) x.Parent = y;
            else {
                Transplant(y, y.Right);
                y.Right = z.Right; y.Right.Parent = y;
            }
            Transplant(z, y);
            y.Left = z.Left; y.Left.Parent = y;
            y.Red = z.Red;
        }
        if (!removedRed) Fixup(x);
    }

    void Fixup(Node x) {
        while (x != root && !x.Red) {
            if (x == x.Parent.Left) {
                Node w = x.Parent.Right;
                if (w.Red) {
                    w.Red = false; x.Parent.Red = true;
                    RotateLeft(x.Parent); w = x.Parent.Right;
                }
                if (!w.Left.Red && !w.Right.Red) { w.Red = true; x = x.Parent; }
                else {
                    if (!w.Right.Red) {
                        w.Left.Red = false; w.Red = true;
                        RotateRight(w); w = x.Parent.Right;
                    }
                    w.Red = x.Parent.Red;
                    x.Parent.Red = false; w.Right.Red = false;
                    RotateLeft(x.Parent);
                    x = root;
                }
            } else {
                Node w = x.Parent.Left;
                if (w.Red) {
                    w.Red = false; x.Parent.Red = true;
                    RotateRight(x.Parent); w = x.Parent.Left;
                }
                if (!w.Right.Red && !w.Left.Red) { w.Red = true; x = x.Parent; }
                else {
                    if (!w.Left.Red) {
                        w.Right.Red = false; w.Red = true;
                        RotateLeft(w); w = x.Parent.Left;
                    }
                    w.Red = x.Parent.Red;
                    x.Parent.Red = false; w.Left.Red = false;
                    RotateRight(x.Parent);
                    x = root;
                }
            }
        }
        x.Red = false;
    }
}`,
  ),

  "heap-min-insert": snippets(
    `typedef struct { int* a; int size, cap; } MinHeap;

MinHeap* heap_new(int cap) {
    MinHeap* h = (MinHeap*)malloc(sizeof(MinHeap));
    h->a = (int*)malloc(sizeof(int) * cap);
    h->size = 0; h->cap = cap;
    return h;
}

static void swap_at(int* a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

void sift_up(MinHeap* h, int i) {
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (h->a[parent] <= h->a[i]) break;
        swap_at(h->a, parent, i);
        i = parent;
    }
}

int heap_insert(MinHeap* h, int key) {
    if (h->size == h->cap) return 0;
    h->a[h->size] = key;
    sift_up(h, h->size);
    h->size++;
    return 1;
}

int heap_peek(MinHeap* h) { return h->size ? h->a[0] : -1; }`,
    `struct MinHeap {
    vector<int> a;

    void sift_up(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[parent] <= a[i]) break;
            swap(a[parent], a[i]);
            i = parent;
        }
    }

    void insert(int key) {
        a.push_back(key);
        sift_up((int)a.size() - 1);
    }

    int peek() const { return a.front(); }
    bool empty() const { return a.empty(); }

    void insert_all(const vector<int>& keys) {
        for (int k : keys) insert(k);
    }
};`,
    `class MinHeap:
    def __init__(self):
        self.a = []

    def sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self.a[parent] <= self.a[i]:
                break
            self.a[parent], self.a[i] = self.a[i], self.a[parent]
            i = parent

    def insert(self, key):
        self.a.append(key)
        self.sift_up(len(self.a) - 1)

    def peek(self):
        return self.a[0] if self.a else None

    def insert_all(self, keys):
        for k in keys:
            self.insert(k)
        return self`,
    `class MinHeap {
    private final int[] a;
    private int size = 0;

    MinHeap(int cap) { a = new int[cap]; }

    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[parent] <= a[i]) break;
            swap(parent, i);
            i = parent;
        }
    }

    void insert(int key) {
        a[size] = key;
        siftUp(size);
        size++;
    }

    int peek() { return a[0]; }
    int size() { return size; }
}`,
    `class MinHeap {
  constructor() {
    this.a = [];
  }

  siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.a[parent] <= this.a[i]) break;
      [this.a[parent], this.a[i]] = [this.a[i], this.a[parent]];
      i = parent;
    }
  }

  insert(key) {
    this.a.push(key);
    this.siftUp(this.a.length - 1);
    return this;
  }

  peek() {
    return this.a.length ? this.a[0] : undefined;
  }

  get size() {
    return this.a.length;
  }
}`,
    `class MinHeap {
    readonly List<int> a = new();

    public int Count => a.Count;

    void Swap(int i, int j) { (a[i], a[j]) = (a[j], a[i]); }

    void SiftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[parent] <= a[i]) break;
            Swap(parent, i);
            i = parent;
        }
    }

    public void Insert(int key) {
        a.Add(key);
        SiftUp(a.Count - 1);
    }

    public int Peek() => a[0];
}`,
  ),

  "heap-max-insert": snippets(
    `typedef struct { int* a; int size, cap; } MaxHeap;

MaxHeap* heap_new(int cap) {
    MaxHeap* h = (MaxHeap*)malloc(sizeof(MaxHeap));
    h->a = (int*)malloc(sizeof(int) * cap);
    h->size = 0; h->cap = cap;
    return h;
}

static void swap_at(int* a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

void sift_up(MaxHeap* h, int i) {
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (h->a[parent] >= h->a[i]) break;
        swap_at(h->a, parent, i);
        i = parent;
    }
}

int heap_insert(MaxHeap* h, int key) {
    if (h->size == h->cap) return 0;
    h->a[h->size] = key;
    sift_up(h, h->size);
    h->size++;
    return 1;
}

int heap_peek(MaxHeap* h) { return h->size ? h->a[0] : -1; }`,
    `struct MaxHeap {
    vector<int> a;

    void sift_up(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[parent] >= a[i]) break;
            swap(a[parent], a[i]);
            i = parent;
        }
    }

    void insert(int key) {
        a.push_back(key);
        sift_up((int)a.size() - 1);
    }

    int peek() const { return a.front(); }
    bool empty() const { return a.empty(); }

    void insert_all(const vector<int>& keys) {
        for (int k : keys) insert(k);
    }
};`,
    `class MaxHeap:
    def __init__(self):
        self.a = []

    def sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self.a[parent] >= self.a[i]:
                break
            self.a[parent], self.a[i] = self.a[i], self.a[parent]
            i = parent

    def insert(self, key):
        self.a.append(key)
        self.sift_up(len(self.a) - 1)

    def peek(self):
        return self.a[0] if self.a else None

    def insert_all(self, keys):
        for k in keys:
            self.insert(k)
        return self`,
    `class MaxHeap {
    private final int[] a;
    private int count = 0;

    MaxHeap(int cap) { a = new int[cap]; }

    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[parent] >= a[i]) break;
            swap(parent, i);
            i = parent;
        }
    }

    void insert(int key) {
        a[count] = key;
        siftUp(count);
        count++;
    }

    int peek() { return a[0]; }
    int size() { return count; }
}`,
    `class MaxHeap {
  constructor() {
    this.a = [];
  }

  siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.a[parent] >= this.a[i]) break;
      [this.a[parent], this.a[i]] = [this.a[i], this.a[parent]];
      i = parent;
    }
  }

  insert(key) {
    this.a.push(key);
    this.siftUp(this.a.length - 1);
    return this;
  }

  peek() {
    return this.a.length ? this.a[0] : undefined;
  }

  get size() {
    return this.a.length;
  }
}`,
    `class MaxHeap {
    readonly List<int> a = new();

    public int Count => a.Count;

    void Swap(int i, int j) { (a[i], a[j]) = (a[j], a[i]); }

    void SiftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[parent] >= a[i]) break;
            Swap(parent, i);
            i = parent;
        }
    }

    public void Insert(int key) {
        a.Add(key);
        SiftUp(a.Count - 1);
    }

    public int Peek() => a[0];
}`,
  ),

  "heap-extract": snippets(
    `typedef struct { int* a; int size, cap; } MinHeap;

static void swap_at(int* a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

void sift_down(int* a, int n, int i) {
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, best = i;
        if (l < n && a[l] < a[best]) best = l;
        if (r < n && a[r] < a[best]) best = r;
        if (best == i) return;
        swap_at(a, i, best);
        i = best;
    }
}

int heap_extract_min(MinHeap* h, int* out) {
    if (h->size == 0) return 0;
    *out = h->a[0];
    h->a[0] = h->a[--h->size];
    sift_down(h->a, h->size, 0);
    return 1;
}

int heap_replace(MinHeap* h, int key) {
    int top = h->a[0];
    h->a[0] = key;
    sift_down(h->a, h->size, 0);
    return top;
}`,
    `struct MinHeap {
    vector<int> a;

    void sift_down(int i) {
        int n = (int)a.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, best = i;
            if (l < n && a[l] < a[best]) best = l;
            if (r < n && a[r] < a[best]) best = r;
            if (best == i) return;
            swap(a[i], a[best]);
            i = best;
        }
    }

    int extract_min() {
        int top = a.front();
        a.front() = a.back();
        a.pop_back();
        if (!a.empty()) sift_down(0);
        return top;
    }

    int replace_top(int key) {
        int top = a.front();
        a.front() = key;
        sift_down(0);
        return top;
    }
};`,
    `class MinHeap:
    def __init__(self, values=None):
        self.a = list(values or [])

    def sift_down(self, i):
        n = len(self.a)
        while True:
            left, right, best = 2 * i + 1, 2 * i + 2, i
            if left < n and self.a[left] < self.a[best]:
                best = left
            if right < n and self.a[right] < self.a[best]:
                best = right
            if best == i:
                return
            self.a[i], self.a[best] = self.a[best], self.a[i]
            i = best

    def extract_min(self):
        if not self.a:
            return None
        top = self.a[0]
        last = self.a.pop()
        if self.a:
            self.a[0] = last
            self.sift_down(0)
        return top

    def replace_top(self, key):
        top = self.a[0]
        self.a[0] = key
        self.sift_down(0)
        return top`,
    `class MinHeap {
    private final int[] a;
    private int count;

    MinHeap(int[] values, int count) { a = values; this.count = count; }

    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    void siftDown(int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, best = i;
            if (l < count && a[l] < a[best]) best = l;
            if (r < count && a[r] < a[best]) best = r;
            if (best == i) return;
            swap(i, best);
            i = best;
        }
    }

    int extractMin() {
        int top = a[0];
        a[0] = a[--count];
        siftDown(0);
        return top;
    }

    int replaceTop(int key) {
        int top = a[0];
        a[0] = key;
        siftDown(0);
        return top;
    }
}`,
    `class MinHeap {
  constructor(values = []) {
    this.a = [...values];
  }

  siftDown(i) {
    const n = this.a.length;
    for (;;) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < n && this.a[l] < this.a[best]) best = l;
      if (r < n && this.a[r] < this.a[best]) best = r;
      if (best === i) return;
      [this.a[i], this.a[best]] = [this.a[best], this.a[i]];
      i = best;
    }
  }

  extractMin() {
    if (!this.a.length) return undefined;
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  replaceTop(key) {
    const top = this.a[0];
    this.a[0] = key;
    this.siftDown(0);
    return top;
  }
}`,
    `class MinHeap {
    readonly List<int> a;

    public MinHeap(IEnumerable<int> values) { a = new List<int>(values); }

    public int Count => a.Count;

    void Swap(int i, int j) { (a[i], a[j]) = (a[j], a[i]); }

    public void SiftDown(int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, best = i;
            if (l < a.Count && a[l] < a[best]) best = l;
            if (r < a.Count && a[r] < a[best]) best = r;
            if (best == i) return;
            Swap(i, best);
            i = best;
        }
    }

    public int ExtractMin() {
        int top = a[0];
        a[0] = a[^1];
        a.RemoveAt(a.Count - 1);
        if (a.Count > 0) SiftDown(0);
        return top;
    }

    public int ReplaceTop(int key) {
        int top = a[0];
        a[0] = key;
        SiftDown(0);
        return top;
    }
}`,
  ),

  "heap-heapify": snippets(
    `static void swap_at(int* a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

/* max-heapify: push a[i] down until the subtree is a valid heap */
void heapify(int* a, int n, int i) {
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        swap_at(a, i, largest);
        i = largest;
    }
}

void heapify_rec(int* a, int n, int i) {
    int l = 2 * i + 1, r = 2 * i + 2, largest = i;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest != i) {
        swap_at(a, i, largest);
        heapify_rec(a, n, largest);
    }
}

int is_max_heap(int* a, int n) {
    for (int i = 0; i < n; i++) {
        int l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && a[l] > a[i]) return 0;
        if (r < n && a[r] > a[i]) return 0;
    }
    return 1;
}`,
    `// max-heapify: sink a[i] to its correct place
void heapify(vector<int>& a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        swap(a[i], a[largest]);
        i = largest;
    }
}

void heapify_rec(vector<int>& a, int n, int i) {
    int l = 2 * i + 1, r = 2 * i + 2, largest = i;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest != i) {
        swap(a[i], a[largest]);
        heapify_rec(a, n, largest);
    }
}

bool is_max_heap(const vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n; i++) {
        int l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && a[l] > a[i]) return false;
        if (r < n && a[r] > a[i]) return false;
    }
    return true;
}`,
    `def heapify(a, n, i):
    """Max-heapify: sink a[i] until its subtree satisfies the heap property."""
    while True:
        left, right, largest = 2 * i + 1, 2 * i + 2, i
        if left < n and a[left] > a[largest]:
            largest = left
        if right < n and a[right] > a[largest]:
            largest = right
        if largest == i:
            return
        a[i], a[largest] = a[largest], a[i]
        i = largest


def heapify_rec(a, n, i):
    left, right, largest = 2 * i + 1, 2 * i + 2, i
    if left < n and a[left] > a[largest]:
        largest = left
    if right < n and a[right] > a[largest]:
        largest = right
    if largest != i:
        a[i], a[largest] = a[largest], a[i]
        heapify_rec(a, n, largest)


def is_max_heap(a):
    n = len(a)
    for i in range(n):
        for child in (2 * i + 1, 2 * i + 2):
            if child < n and a[child] > a[i]:
                return False
    return True`,
    `class Heapify {
    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    // max-heapify: sink a[i] into place
    static void heapify(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            swap(a, i, largest);
            i = largest;
        }
    }

    static void heapifyRec(int[] a, int n, int i) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest != i) {
            swap(a, i, largest);
            heapifyRec(a, n, largest);
        }
    }

    static boolean isMaxHeap(int[] a) {
        for (int i = 0; i < a.length; i++) {
            int l = 2 * i + 1, r = 2 * i + 2;
            if (l < a.length && a[l] > a[i]) return false;
            if (r < a.length && a[r] > a[i]) return false;
        }
        return true;
    }
}`,
    `// max-heapify: sink a[i] until the subtree is a valid heap
function heapify(a, n, i) {
  for (;;) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let largest = i;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest === i) return a;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}

function heapifyRec(a, n, i) {
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  let largest = i;
  if (l < n && a[l] > a[largest]) largest = l;
  if (r < n && a[r] > a[largest]) largest = r;
  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    heapifyRec(a, n, largest);
  }
  return a;
}

function isMaxHeap(a) {
  for (let i = 0; i < a.length; i++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < a.length && a[l] > a[i]) return false;
    if (r < a.length && a[r] > a[i]) return false;
  }
  return true;
}`,
    `static class Heapify {
    static void Swap(int[] a, int i, int j) { (a[i], a[j]) = (a[j], a[i]); }

    // max-heapify: sink a[i] into place
    public static void Sink(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            Swap(a, i, largest);
            i = largest;
        }
    }

    public static void SinkRec(int[] a, int n, int i) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest != i) {
            Swap(a, i, largest);
            SinkRec(a, n, largest);
        }
    }

    public static bool IsMaxHeap(int[] a) {
        for (int i = 0; i < a.Length; i++) {
            int l = 2 * i + 1, r = 2 * i + 2;
            if (l < a.Length && a[l] > a[i]) return false;
            if (r < a.Length && a[r] > a[i]) return false;
        }
        return true;
    }
}`,
  ),

  "heap-build": snippets(
    `static void swap_at(int* a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

void heapify(int* a, int n, int i) {
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        swap_at(a, i, largest);
        i = largest;
    }
}

/* bottom-up build in O(n): sink every internal node once */
void build_max_heap(int* a, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
}

void build_min_heap(int* a, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        int j = i;
        while (1) {
            int l = 2 * j + 1, r = 2 * j + 2, small = j;
            if (l < n && a[l] < a[small]) small = l;
            if (r < n && a[r] < a[small]) small = r;
            if (small == j) break;
            swap_at(a, j, small);
            j = small;
        }
    }
}`,
    `void heapify(vector<int>& a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        swap(a[i], a[largest]);
        i = largest;
    }
}

// bottom-up build in O(n)
void build_max_heap(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
}

void sink_min(vector<int>& a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, small = i;
        if (l < n && a[l] < a[small]) small = l;
        if (r < n && a[r] < a[small]) small = r;
        if (small == i) return;
        swap(a[i], a[small]);
        i = small;
    }
}

void build_min_heap(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; i--) sink_min(a, n, i);
}`,
    `def heapify(a, n, i):
    while True:
        left, right, largest = 2 * i + 1, 2 * i + 2, i
        if left < n and a[left] > a[largest]:
            largest = left
        if right < n and a[right] > a[largest]:
            largest = right
        if largest == i:
            return
        a[i], a[largest] = a[largest], a[i]
        i = largest


def build_max_heap(a):
    """Bottom-up construction: O(n), not O(n log n)."""
    for i in range(len(a) // 2 - 1, -1, -1):
        heapify(a, len(a), i)
    return a


def sink_min(a, n, i):
    while True:
        left, right, small = 2 * i + 1, 2 * i + 2, i
        if left < n and a[left] < a[small]:
            small = left
        if right < n and a[right] < a[small]:
            small = right
        if small == i:
            return
        a[i], a[small] = a[small], a[i]
        i = small


def build_min_heap(a):
    for i in range(len(a) // 2 - 1, -1, -1):
        sink_min(a, len(a), i)
    return a`,
    `class BuildHeap {
    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static void heapify(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            swap(a, i, largest);
            i = largest;
        }
    }

    // bottom-up build in O(n)
    static void buildMaxHeap(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) heapify(a, a.length, i);
    }

    static void sinkMin(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, small = i;
            if (l < n && a[l] < a[small]) small = l;
            if (r < n && a[r] < a[small]) small = r;
            if (small == i) return;
            swap(a, i, small);
            i = small;
        }
    }

    static void buildMinHeap(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) sinkMin(a, a.length, i);
    }
}`,
    `function heapify(a, n, i) {
  for (;;) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let largest = i;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest === i) return;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}

// bottom-up build in O(n)
function buildMaxHeap(a) {
  for (let i = (a.length >> 1) - 1; i >= 0; i--) heapify(a, a.length, i);
  return a;
}

function sinkMin(a, n, i) {
  for (;;) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let small = i;
    if (l < n && a[l] < a[small]) small = l;
    if (r < n && a[r] < a[small]) small = r;
    if (small === i) return;
    [a[i], a[small]] = [a[small], a[i]];
    i = small;
  }
}

function buildMinHeap(a) {
  for (let i = (a.length >> 1) - 1; i >= 0; i--) sinkMin(a, a.length, i);
  return a;
}`,
    `static class BuildHeap {
    static void Swap(int[] a, int i, int j) { (a[i], a[j]) = (a[j], a[i]); }

    static void Heapify(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            Swap(a, i, largest);
            i = largest;
        }
    }

    // bottom-up build in O(n)
    public static void BuildMaxHeap(int[] a) {
        for (int i = a.Length / 2 - 1; i >= 0; i--) Heapify(a, a.Length, i);
    }

    static void SinkMin(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, small = i;
            if (l < n && a[l] < a[small]) small = l;
            if (r < n && a[r] < a[small]) small = r;
            if (small == i) return;
            Swap(a, i, small);
            i = small;
        }
    }

    public static void BuildMinHeap(int[] a) {
        for (int i = a.Length / 2 - 1; i >= 0; i--) SinkMin(a, a.Length, i);
    }
}`,
  ),

  "heap-sort": snippets(
    `static void swap_at(int* a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

void heapify(int* a, int n, int i) {
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        swap_at(a, i, largest);
        i = largest;
    }
}

void heap_sort(int* a, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int end = n - 1; end > 0; end--) {
        swap_at(a, 0, end);
        heapify(a, end, 0);
    }
}`,
    `void heapify(vector<int>& a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        swap(a[i], a[largest]);
        i = largest;
    }
}

void heap_sort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int end = n - 1; end > 0; end--) {
        swap(a[0], a[end]);
        heapify(a, end, 0);
    }
}`,
    `def heapify(a, n, i):
    while True:
        left, right, largest = 2 * i + 1, 2 * i + 2, i
        if left < n and a[left] > a[largest]:
            largest = left
        if right < n and a[right] > a[largest]:
            largest = right
        if largest == i:
            return
        a[i], a[largest] = a[largest], a[i]
        i = largest


def heap_sort(a):
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        heapify(a, n, i)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        heapify(a, end, 0)
    return a`,
    `class HeapSort {
    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static void heapify(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            swap(a, i, largest);
            i = largest;
        }
    }

    static void sort(int[] a) {
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
        for (int end = n - 1; end > 0; end--) {
            swap(a, 0, end);
            heapify(a, end, 0);
        }
    }
}`,
    `function heapify(a, n, i) {
  for (;;) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let largest = i;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest === i) return;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}

function heapSort(a) {
  const n = a.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) heapify(a, n, i);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    heapify(a, end, 0);
  }
  return a;
}`,
    `static class HeapSort {
    static void Swap(int[] a, int i, int j) { (a[i], a[j]) = (a[j], a[i]); }

    static void Heapify(int[] a, int n, int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            Swap(a, i, largest);
            i = largest;
        }
    }

    public static void Sort(int[] a) {
        int n = a.Length;
        for (int i = n / 2 - 1; i >= 0; i--) Heapify(a, n, i);
        for (int end = n - 1; end > 0; end--) {
            Swap(a, 0, end);
            Heapify(a, end, 0);
        }
    }
}`,
  ),

  "trie-insert": snippets(
    `#define ALPHABET 26

typedef struct TrieNode {
    struct TrieNode* children[ALPHABET];
    int is_word;
} TrieNode;

TrieNode* trie_new(void) {
    return (TrieNode*)calloc(1, sizeof(TrieNode));
}

void trie_insert(TrieNode* root, const char* word) {
    TrieNode* cur = root;
    for (int i = 0; word[i]; i++) {
        int c = word[i] - 'a';
        if (!cur->children[c]) cur->children[c] = trie_new();
        cur = cur->children[c];
    }
    cur->is_word = 1;
}

void trie_insert_all(TrieNode* root, const char** words, int n) {
    for (int i = 0; i < n; i++) trie_insert(root, words[i]);
}

void trie_free(TrieNode* n) {
    if (!n) return;
    for (int c = 0; c < ALPHABET; c++) trie_free(n->children[c]);
    free(n);
}`,
    `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool is_word = false;
};

struct Trie {
    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        TrieNode* cur = root;
        for (char ch : word) {
            auto it = cur->children.find(ch);
            if (it == cur->children.end()) {
                TrieNode* fresh = new TrieNode();
                cur->children[ch] = fresh;
                cur = fresh;
            } else {
                cur = it->second;
            }
        }
        cur->is_word = true;
    }

    void insert_all(const vector<string>& words) {
        for (const string& w : words) insert(w);
    }

    int size(TrieNode* n) const {
        int total = n->is_word ? 1 : 0;
        for (auto& [ch, kid] : n->children) total += size(kid);
        return total;
    }
};`,
    `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False


class Trie:
    def __init__(self, words=None):
        self.root = TrieNode()
        for word in words or []:
            self.insert(word)

    def insert(self, word):
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = TrieNode()
            cur = cur.children[ch]
        cur.is_word = True
        return self

    def __len__(self):
        def count(node):
            total = 1 if node.is_word else 0
            for kid in node.children.values():
                total += count(kid)
            return total

        return count(self.root)`,
    `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isWord = false;
}

class Trie {
    final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);
            cur = cur.children.computeIfAbsent(ch, k -> new TrieNode());
        }
        cur.isWord = true;
    }

    void insertAll(List<String> words) {
        for (String w : words) insert(w);
    }

    int size() { return count(root); }

    private int count(TrieNode n) {
        int total = n.isWord ? 1 : 0;
        for (TrieNode kid : n.children.values()) total += count(kid);
        return total;
    }
}`,
    `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor(words = []) {
    this.root = new TrieNode();
    for (const word of words) this.insert(word);
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      let next = cur.children.get(ch);
      if (!next) {
        next = new TrieNode();
        cur.children.set(ch, next);
      }
      cur = next;
    }
    cur.isWord = true;
    return this;
  }

  get size() {
    const count = (node) => {
      let total = node.isWord ? 1 : 0;
      for (const kid of node.children.values()) total += count(kid);
      return total;
    };
    return count(this.root);
  }
}`,
    `class TrieNode {
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsWord { get; set; }
}

class Trie {
    public TrieNode Root { get; } = new TrieNode();

    public void Insert(string word) {
        TrieNode cur = Root;
        foreach (char ch in word) {
            if (!cur.Children.TryGetValue(ch, out TrieNode? next)) {
                next = new TrieNode();
                cur.Children[ch] = next;
            }
            cur = next;
        }
        cur.IsWord = true;
    }

    public void InsertAll(IEnumerable<string> words) {
        foreach (string w in words) Insert(w);
    }

    public int Count => CountFrom(Root);

    static int CountFrom(TrieNode n) {
        int total = n.IsWord ? 1 : 0;
        foreach (TrieNode kid in n.Children.Values) total += CountFrom(kid);
        return total;
    }
}`,
  ),

  "trie-search": snippets(
    `#define ALPHABET 26

typedef struct TrieNode {
    struct TrieNode* children[ALPHABET];
    int is_word;
} TrieNode;

TrieNode* trie_new(void) { return (TrieNode*)calloc(1, sizeof(TrieNode)); }

void trie_insert(TrieNode* root, const char* word) {
    TrieNode* cur = root;
    for (int i = 0; word[i]; i++) {
        int c = word[i] - 'a';
        if (!cur->children[c]) cur->children[c] = trie_new();
        cur = cur->children[c];
    }
    cur->is_word = 1;
}

TrieNode* trie_walk(TrieNode* root, const char* s) {
    TrieNode* cur = root;
    for (int i = 0; s[i] && cur; i++) {
        int c = s[i] - 'a';
        if (c < 0 || c >= ALPHABET) return NULL;
        cur = cur->children[c];
    }
    return cur;
}

int trie_contains(TrieNode* root, const char* word) {
    TrieNode* n = trie_walk(root, word);
    return n && n->is_word;
}

int trie_starts_with(TrieNode* root, const char* prefix) {
    return trie_walk(root, prefix) != NULL;
}

int longest_match(TrieNode* root, const char* s) {
    TrieNode* cur = root;
    int best = 0;
    for (int i = 0; s[i] && cur; i++) {
        cur = cur->children[s[i] - 'a'];
        if (cur && cur->is_word) best = i + 1;
    }
    return best;
}`,
    `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool is_word = false;
};

struct Trie {
    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        TrieNode* cur = root;
        for (char ch : word) {
            TrieNode*& slot = cur->children[ch];
            if (!slot) slot = new TrieNode();
            cur = slot;
        }
        cur->is_word = true;
    }

    TrieNode* walk(const string& s) const {
        TrieNode* cur = root;
        for (char ch : s) {
            auto it = cur->children.find(ch);
            if (it == cur->children.end()) return nullptr;
            cur = it->second;
        }
        return cur;
    }

    bool contains(const string& word) const {
        TrieNode* n = walk(word);
        return n && n->is_word;
    }

    bool starts_with(const string& prefix) const { return walk(prefix) != nullptr; }

    int longest_match(const string& s) const {
        TrieNode* cur = root;
        int best = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            auto it = cur->children.find(s[i]);
            if (it == cur->children.end()) break;
            cur = it->second;
            if (cur->is_word) best = i + 1;
        }
        return best;
    }
};`,
    `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False


class Trie:
    def __init__(self, words=None):
        self.root = TrieNode()
        for word in words or []:
            self.insert(word)

    def insert(self, word):
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = TrieNode()
            cur = cur.children[ch]
        cur.is_word = True
        return self

    def walk(self, s):
        cur = self.root
        for ch in s:
            cur = cur.children.get(ch)
            if cur is None:
                return None
        return cur

    def contains(self, word):
        node = self.walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self.walk(prefix) is not None

    def longest_match(self, s):
        cur, best = self.root, 0
        for i, ch in enumerate(s):
            cur = cur.children.get(ch)
            if cur is None:
                break
            if cur.is_word:
                best = i + 1
        return best`,
    `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isWord = false;
}

class Trie {
    final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (int i = 0; i < word.length(); i++) {
            cur = cur.children.computeIfAbsent(word.charAt(i), k -> new TrieNode());
        }
        cur.isWord = true;
    }

    TrieNode walk(String s) {
        TrieNode cur = root;
        for (int i = 0; i < s.length(); i++) {
            cur = cur.children.get(s.charAt(i));
            if (cur == null) return null;
        }
        return cur;
    }

    boolean contains(String word) {
        TrieNode n = walk(word);
        return n != null && n.isWord;
    }

    boolean startsWith(String prefix) { return walk(prefix) != null; }

    int longestMatch(String s) {
        TrieNode cur = root;
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            cur = cur.children.get(s.charAt(i));
            if (cur == null) break;
            if (cur.isWord) best = i + 1;
        }
        return best;
    }
}`,
    `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor(words = []) {
    this.root = new TrieNode();
    for (const word of words) this.insert(word);
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      let next = cur.children.get(ch);
      if (!next) {
        next = new TrieNode();
        cur.children.set(ch, next);
      }
      cur = next;
    }
    cur.isWord = true;
    return this;
  }

  walk(s) {
    let cur = this.root;
    for (const ch of s) {
      cur = cur.children.get(ch);
      if (!cur) return null;
    }
    return cur;
  }

  contains(word) {
    const node = this.walk(word);
    return Boolean(node && node.isWord);
  }

  startsWith(prefix) {
    return this.walk(prefix) !== null;
  }

  longestMatch(s) {
    let cur = this.root;
    let best = 0;
    for (let i = 0; i < s.length; i++) {
      cur = cur.children.get(s[i]);
      if (!cur) break;
      if (cur.isWord) best = i + 1;
    }
    return best;
  }
}`,
    `class TrieNode {
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsWord { get; set; }
}

class Trie {
    public TrieNode Root { get; } = new TrieNode();

    public void Insert(string word) {
        TrieNode cur = Root;
        foreach (char ch in word) {
            if (!cur.Children.TryGetValue(ch, out TrieNode? next)) {
                next = new TrieNode();
                cur.Children[ch] = next;
            }
            cur = next;
        }
        cur.IsWord = true;
    }

    public TrieNode? Walk(string s) {
        TrieNode cur = Root;
        foreach (char ch in s) {
            if (!cur.Children.TryGetValue(ch, out TrieNode? next)) return null;
            cur = next;
        }
        return cur;
    }

    public bool Contains(string word) {
        TrieNode? n = Walk(word);
        return n != null && n.IsWord;
    }

    public bool StartsWith(string prefix) => Walk(prefix) != null;

    public int LongestMatch(string s) {
        TrieNode cur = Root;
        int best = 0;
        for (int i = 0; i < s.Length; i++) {
            if (!cur.Children.TryGetValue(s[i], out TrieNode? next)) break;
            cur = next;
            if (cur.IsWord) best = i + 1;
        }
        return best;
    }
}`,
  ),

  "trie-delete": snippets(
    `#define ALPHABET 26

typedef struct TrieNode {
    struct TrieNode* children[ALPHABET];
    int is_word;
} TrieNode;

TrieNode* trie_new(void) { return (TrieNode*)calloc(1, sizeof(TrieNode)); }

void trie_insert(TrieNode* root, const char* word) {
    TrieNode* cur = root;
    for (int i = 0; word[i]; i++) {
        int c = word[i] - 'a';
        if (!cur->children[c]) cur->children[c] = trie_new();
        cur = cur->children[c];
    }
    cur->is_word = 1;
}

int has_children(TrieNode* n) {
    for (int c = 0; c < ALPHABET; c++) if (n->children[c]) return 1;
    return 0;
}

/* returns the (possibly freed) subtree so the parent can unlink it */
TrieNode* trie_delete(TrieNode* n, const char* word, int depth) {
    if (!n) return NULL;
    if (!word[depth]) {
        if (!n->is_word) return n;
        n->is_word = 0;
    } else {
        int c = word[depth] - 'a';
        n->children[c] = trie_delete(n->children[c], word, depth + 1);
    }
    if (!n->is_word && !has_children(n) && depth > 0) {
        free(n);
        return NULL;
    }
    return n;
}

void trie_remove(TrieNode* root, const char* word) {
    trie_delete(root, word, 0);
}`,
    `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool is_word = false;
};

struct Trie {
    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        TrieNode* cur = root;
        for (char ch : word) {
            TrieNode*& slot = cur->children[ch];
            if (!slot) slot = new TrieNode();
            cur = slot;
        }
        cur->is_word = true;
    }

    // returns true when the child node may be unlinked and freed
    bool erase(TrieNode* n, const string& word, size_t depth) {
        if (!n) return false;
        if (depth == word.size()) {
            if (!n->is_word) return false;
            n->is_word = false;
        } else {
            auto it = n->children.find(word[depth]);
            if (it == n->children.end()) return false;
            if (erase(it->second, word, depth + 1)) {
                delete it->second;
                n->children.erase(it);
            }
        }
        return !n->is_word && n->children.empty();
    }

    void remove(const string& word) { erase(root, word, 0); }
};`,
    `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False


class Trie:
    def __init__(self, words=None):
        self.root = TrieNode()
        for word in words or []:
            self.insert(word)

    def insert(self, word):
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = TrieNode()
            cur = cur.children[ch]
        cur.is_word = True
        return self

    def remove(self, word):
        self._erase(self.root, word, 0)

    def _erase(self, node, word, depth):
        """Returns True when the caller should unlink this node."""
        if node is None:
            return False
        if depth == len(word):
            if not node.is_word:
                return False
            node.is_word = False
        else:
            ch = word[depth]
            child = node.children.get(ch)
            if child is None:
                return False
            if self._erase(child, word, depth + 1):
                del node.children[ch]
        return not node.is_word and not node.children`,
    `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isWord = false;
}

class Trie {
    final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (int i = 0; i < word.length(); i++) {
            cur = cur.children.computeIfAbsent(word.charAt(i), k -> new TrieNode());
        }
        cur.isWord = true;
    }

    void remove(String word) { erase(root, word, 0); }

    // returns true when the parent should unlink this node
    private boolean erase(TrieNode n, String word, int depth) {
        if (n == null) return false;
        if (depth == word.length()) {
            if (!n.isWord) return false;
            n.isWord = false;
        } else {
            char ch = word.charAt(depth);
            TrieNode child = n.children.get(ch);
            if (child == null) return false;
            if (erase(child, word, depth + 1)) n.children.remove(ch);
        }
        return !n.isWord && n.children.isEmpty();
    }
}`,
    `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor(words = []) {
    this.root = new TrieNode();
    for (const word of words) this.insert(word);
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      let next = cur.children.get(ch);
      if (!next) {
        next = new TrieNode();
        cur.children.set(ch, next);
      }
      cur = next;
    }
    cur.isWord = true;
    return this;
  }

  remove(word) {
    this.erase(this.root, word, 0);
    return this;
  }

  // returns true when the parent should unlink this node
  erase(node, word, depth) {
    if (!node) return false;
    if (depth === word.length) {
      if (!node.isWord) return false;
      node.isWord = false;
    } else {
      const ch = word[depth];
      const child = node.children.get(ch);
      if (!child) return false;
      if (this.erase(child, word, depth + 1)) node.children.delete(ch);
    }
    return !node.isWord && node.children.size === 0;
  }
}`,
    `class TrieNode {
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsWord { get; set; }
}

class Trie {
    public TrieNode Root { get; } = new TrieNode();

    public void Insert(string word) {
        TrieNode cur = Root;
        foreach (char ch in word) {
            if (!cur.Children.TryGetValue(ch, out TrieNode? next)) {
                next = new TrieNode();
                cur.Children[ch] = next;
            }
            cur = next;
        }
        cur.IsWord = true;
    }

    public void Remove(string word) => Erase(Root, word, 0);

    // returns true when the parent should unlink this node
    static bool Erase(TrieNode? n, string word, int depth) {
        if (n == null) return false;
        if (depth == word.Length) {
            if (!n.IsWord) return false;
            n.IsWord = false;
        } else {
            char ch = word[depth];
            if (!n.Children.TryGetValue(ch, out TrieNode? child)) return false;
            if (Erase(child, word, depth + 1)) n.Children.Remove(ch);
        }
        return !n.IsWord && n.Children.Count == 0;
    }
}`,
  ),

  "trie-prefix": snippets(
    `#define ALPHABET 26

typedef struct TrieNode {
    struct TrieNode* children[ALPHABET];
    int is_word;
} TrieNode;

TrieNode* trie_new(void) { return (TrieNode*)calloc(1, sizeof(TrieNode)); }

void trie_insert(TrieNode* root, const char* word) {
    TrieNode* cur = root;
    for (int i = 0; word[i]; i++) {
        int c = word[i] - 'a';
        if (!cur->children[c]) cur->children[c] = trie_new();
        cur = cur->children[c];
    }
    cur->is_word = 1;
}

TrieNode* trie_walk(TrieNode* root, const char* s) {
    TrieNode* cur = root;
    for (int i = 0; s[i] && cur; i++) cur = cur->children[s[i] - 'a'];
    return cur;
}

void collect(TrieNode* n, char* buf, int depth, void (*emit)(const char*)) {
    if (!n) return;
    if (n->is_word) { buf[depth] = 0; emit(buf); }
    for (int c = 0; c < ALPHABET; c++) {
        if (n->children[c]) {
            buf[depth] = (char)('a' + c);
            collect(n->children[c], buf, depth + 1, emit);
        }
    }
}

void words_with_prefix(TrieNode* root, const char* prefix, void (*emit)(const char*)) {
    TrieNode* start = trie_walk(root, prefix);
    if (!start) return;
    char buf[128];
    int len = 0;
    while (prefix[len]) { buf[len] = prefix[len]; len++; }
    collect(start, buf, len, emit);
}

int count_with_prefix(TrieNode* n) {
    if (!n) return 0;
    int total = n->is_word ? 1 : 0;
    for (int c = 0; c < ALPHABET; c++) total += count_with_prefix(n->children[c]);
    return total;
}`,
    `struct TrieNode {
    map<char, TrieNode*> children;
    bool is_word = false;
};

struct Trie {
    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        TrieNode* cur = root;
        for (char ch : word) {
            TrieNode*& slot = cur->children[ch];
            if (!slot) slot = new TrieNode();
            cur = slot;
        }
        cur->is_word = true;
    }

    TrieNode* walk(const string& s) const {
        TrieNode* cur = root;
        for (char ch : s) {
            auto it = cur->children.find(ch);
            if (it == cur->children.end()) return nullptr;
            cur = it->second;
        }
        return cur;
    }

    void collect(TrieNode* n, string& buf, vector<string>& out) const {
        if (n->is_word) out.push_back(buf);
        for (auto& [ch, kid] : n->children) {
            buf.push_back(ch);
            collect(kid, buf, out);
            buf.pop_back();
        }
    }

    vector<string> with_prefix(const string& prefix) const {
        vector<string> out;
        TrieNode* start = walk(prefix);
        if (!start) return out;
        string buf = prefix;
        collect(start, buf, out);
        return out;
    }

    int count_with_prefix(const string& prefix) const {
        return (int)with_prefix(prefix).size();
    }
};`,
    `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False


class Trie:
    def __init__(self, words=None):
        self.root = TrieNode()
        for word in words or []:
            self.insert(word)

    def insert(self, word):
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = TrieNode()
            cur = cur.children[ch]
        cur.is_word = True
        return self

    def walk(self, s):
        cur = self.root
        for ch in s:
            cur = cur.children.get(ch)
            if cur is None:
                return None
        return cur

    def with_prefix(self, prefix):
        start = self.walk(prefix)
        if start is None:
            return []
        out = []
        self._collect(start, list(prefix), out)
        return out

    def _collect(self, node, buf, out):
        if node.is_word:
            out.append("".join(buf))
        for ch in sorted(node.children):
            buf.append(ch)
            self._collect(node.children[ch], buf, out)
            buf.pop()

    def count_with_prefix(self, prefix):
        return len(self.with_prefix(prefix))`,
    `class TrieNode {
    Map<Character, TrieNode> children = new TreeMap<>();
    boolean isWord = false;
}

class Trie {
    final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (int i = 0; i < word.length(); i++) {
            cur = cur.children.computeIfAbsent(word.charAt(i), k -> new TrieNode());
        }
        cur.isWord = true;
    }

    TrieNode walk(String s) {
        TrieNode cur = root;
        for (int i = 0; i < s.length(); i++) {
            cur = cur.children.get(s.charAt(i));
            if (cur == null) return null;
        }
        return cur;
    }

    List<String> withPrefix(String prefix) {
        List<String> out = new ArrayList<>();
        TrieNode start = walk(prefix);
        if (start == null) return out;
        collect(start, new StringBuilder(prefix), out);
        return out;
    }

    private void collect(TrieNode n, StringBuilder buf, List<String> out) {
        if (n.isWord) out.add(buf.toString());
        for (Map.Entry<Character, TrieNode> e : n.children.entrySet()) {
            buf.append(e.getKey());
            collect(e.getValue(), buf, out);
            buf.deleteCharAt(buf.length() - 1);
        }
    }

    int countWithPrefix(String prefix) { return withPrefix(prefix).size(); }
}`,
    `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor(words = []) {
    this.root = new TrieNode();
    for (const word of words) this.insert(word);
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      let next = cur.children.get(ch);
      if (!next) {
        next = new TrieNode();
        cur.children.set(ch, next);
      }
      cur = next;
    }
    cur.isWord = true;
    return this;
  }

  walk(s) {
    let cur = this.root;
    for (const ch of s) {
      cur = cur.children.get(ch);
      if (!cur) return null;
    }
    return cur;
  }

  withPrefix(prefix) {
    const start = this.walk(prefix);
    if (!start) return [];
    const out = [];
    const collect = (node, buf) => {
      if (node.isWord) out.push(buf);
      for (const ch of [...node.children.keys()].sort()) {
        collect(node.children.get(ch), buf + ch);
      }
    };
    collect(start, prefix);
    return out;
  }

  countWithPrefix(prefix) {
    return this.withPrefix(prefix).length;
  }
}`,
    `class TrieNode {
    public SortedDictionary<char, TrieNode> Children { get; } = new();
    public bool IsWord { get; set; }
}

class Trie {
    public TrieNode Root { get; } = new TrieNode();

    public void Insert(string word) {
        TrieNode cur = Root;
        foreach (char ch in word) {
            if (!cur.Children.TryGetValue(ch, out TrieNode? next)) {
                next = new TrieNode();
                cur.Children[ch] = next;
            }
            cur = next;
        }
        cur.IsWord = true;
    }

    public TrieNode? Walk(string s) {
        TrieNode cur = Root;
        foreach (char ch in s) {
            if (!cur.Children.TryGetValue(ch, out TrieNode? next)) return null;
            cur = next;
        }
        return cur;
    }

    public List<string> WithPrefix(string prefix) {
        var acc = new List<string>();
        TrieNode? start = Walk(prefix);
        if (start == null) return acc;
        Collect(start, prefix, acc);
        return acc;
    }

    static void Collect(TrieNode n, string buf, List<string> acc) {
        if (n.IsWord) acc.Add(buf);
        foreach (var pair in n.Children) Collect(pair.Value, buf + pair.Key, acc);
    }

    public int CountWithPrefix(string prefix) => WithPrefix(prefix).Count;
}`,
  ),

  "seg-build": snippets(
    `typedef struct { int* tree; int n; } SegTree;

void seg_build(int* tree, const int* a, int node, int lo, int hi) {
    if (lo == hi) { tree[node] = a[lo]; return; }
    int mid = (lo + hi) / 2;
    seg_build(tree, a, 2 * node + 1, lo, mid);
    seg_build(tree, a, 2 * node + 2, mid + 1, hi);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}

SegTree* seg_new(const int* a, int n) {
    SegTree* st = (SegTree*)malloc(sizeof(SegTree));
    st->n = n;
    st->tree = (int*)calloc(4 * n, sizeof(int));
    seg_build(st->tree, a, 0, 0, n - 1);
    return st;
}

void seg_free(SegTree* st) {
    free(st->tree);
    free(st);
}`,
    `struct SegTree {
    int n;
    vector<int> tree;

    explicit SegTree(const vector<int>& a) : n((int)a.size()), tree(4 * a.size(), 0) {
        if (n > 0) build(a, 0, 0, n - 1);
    }

    void build(const vector<int>& a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    int root_value() const { return n ? tree[0] : 0; }
};`,
    `class SegTree:
    def __init__(self, values):
        self.n = len(values)
        self.tree = [0] * (4 * max(self.n, 1))
        if self.n:
            self.build(values, 0, 0, self.n - 1)

    def build(self, a, node, lo, hi):
        if lo == hi:
            self.tree[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self.build(a, 2 * node + 1, lo, mid)
        self.build(a, 2 * node + 2, mid + 1, hi)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    @property
    def total(self):
        return self.tree[0] if self.n else 0`,
    `class SegTree {
    final int n;
    final int[] tree;

    SegTree(int[] a) {
        n = a.length;
        tree = new int[4 * Math.max(n, 1)];
        if (n > 0) build(a, 0, 0, n - 1);
    }

    private void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    int total() { return n > 0 ? tree[0] : 0; }
}`,
    `class SegTree {
  constructor(values) {
    this.n = values.length;
    this.tree = new Array(4 * Math.max(this.n, 1)).fill(0);
    if (this.n) this.build(values, 0, 0, this.n - 1);
  }

  build(a, node, lo, hi) {
    if (lo === hi) {
      this.tree[node] = a[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(a, 2 * node + 1, lo, mid);
    this.build(a, 2 * node + 2, mid + 1, hi);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  get total() {
    return this.n ? this.tree[0] : 0;
  }
}`,
    `class SegTree {
    readonly int n;
    readonly int[] tree;

    public SegTree(int[] a) {
        n = a.Length;
        tree = new int[4 * Math.Max(n, 1)];
        if (n > 0) Build(a, 0, 0, n - 1);
    }

    void Build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        Build(a, 2 * node + 1, lo, mid);
        Build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    public int Total => n > 0 ? tree[0] : 0;
}`,
  ),

  "seg-range-sum": snippets(
    `typedef struct { int* tree; int n; } SegTree;

void seg_build(int* tree, const int* a, int node, int lo, int hi) {
    if (lo == hi) { tree[node] = a[lo]; return; }
    int mid = (lo + hi) / 2;
    seg_build(tree, a, 2 * node + 1, lo, mid);
    seg_build(tree, a, 2 * node + 2, mid + 1, hi);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}

int seg_sum(int* tree, int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return tree[node];
    int mid = (lo + hi) / 2;
    return seg_sum(tree, 2 * node + 1, lo, mid, l, r)
         + seg_sum(tree, 2 * node + 2, mid + 1, hi, l, r);
}

SegTree* seg_new(const int* a, int n) {
    SegTree* st = (SegTree*)malloc(sizeof(SegTree));
    st->n = n;
    st->tree = (int*)calloc(4 * n, sizeof(int));
    seg_build(st->tree, a, 0, 0, n - 1);
    return st;
}

int range_sum(SegTree* st, int l, int r) {
    return seg_sum(st->tree, 0, 0, st->n - 1, l, r);
}`,
    `struct SegTree {
    int n;
    vector<long long> tree;

    explicit SegTree(const vector<int>& a) : n((int)a.size()), tree(4 * a.size(), 0) {
        if (n > 0) build(a, 0, 0, n - 1);
    }

    void build(const vector<int>& a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long long query(int node, int lo, int hi, int l, int r) const {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return query(2 * node + 1, lo, mid, l, r)
             + query(2 * node + 2, mid + 1, hi, l, r);
    }

    long long range_sum(int l, int r) const { return query(0, 0, n - 1, l, r); }
};`,
    `class SegTree:
    def __init__(self, values):
        self.n = len(values)
        self.tree = [0] * (4 * max(self.n, 1))
        if self.n:
            self.build(values, 0, 0, self.n - 1)

    def build(self, a, node, lo, hi):
        if lo == hi:
            self.tree[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self.build(a, 2 * node + 1, lo, mid)
        self.build(a, 2 * node + 2, mid + 1, hi)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, node, lo, hi, left, right):
        if right < lo or hi < left:
            return 0
        if left <= lo and hi <= right:
            return self.tree[node]
        mid = (lo + hi) // 2
        return self.query(2 * node + 1, lo, mid, left, right) + self.query(
            2 * node + 2, mid + 1, hi, left, right
        )

    def range_sum(self, left, right):
        return self.query(0, 0, self.n - 1, left, right) if self.n else 0`,
    `class SegTree {
    final int n;
    final long[] tree;

    SegTree(int[] a) {
        n = a.length;
        tree = new long[4 * Math.max(n, 1)];
        if (n > 0) build(a, 0, 0, n - 1);
    }

    private void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    private long query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return query(2 * node + 1, lo, mid, l, r)
             + query(2 * node + 2, mid + 1, hi, l, r);
    }

    long rangeSum(int l, int r) { return n == 0 ? 0 : query(0, 0, n - 1, l, r); }
}`,
    `class SegTree {
  constructor(values) {
    this.n = values.length;
    this.tree = new Array(4 * Math.max(this.n, 1)).fill(0);
    if (this.n) this.build(values, 0, 0, this.n - 1);
  }

  build(a, node, lo, hi) {
    if (lo === hi) {
      this.tree[node] = a[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(a, 2 * node + 1, lo, mid);
    this.build(a, 2 * node + 2, mid + 1, hi);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  query(node, lo, hi, l, r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return this.tree[node];
    const mid = (lo + hi) >> 1;
    return (
      this.query(2 * node + 1, lo, mid, l, r) +
      this.query(2 * node + 2, mid + 1, hi, l, r)
    );
  }

  rangeSum(l, r) {
    return this.n ? this.query(0, 0, this.n - 1, l, r) : 0;
  }
}`,
    `class SegTree {
    readonly int n;
    readonly long[] tree;

    public SegTree(int[] a) {
        n = a.Length;
        tree = new long[4 * Math.Max(n, 1)];
        if (n > 0) Build(a, 0, 0, n - 1);
    }

    void Build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        Build(a, 2 * node + 1, lo, mid);
        Build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long Query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return Query(2 * node + 1, lo, mid, l, r)
             + Query(2 * node + 2, mid + 1, hi, l, r);
    }

    public long RangeSum(int l, int r) => n == 0 ? 0 : Query(0, 0, n - 1, l, r);
}`,
  ),

  "seg-range-min": snippets(
    `#define SEG_INF 1000000000

typedef struct { int* tree; int n; } SegTree;

static int min2(int a, int b) { return a < b ? a : b; }

void seg_build(int* tree, const int* a, int node, int lo, int hi) {
    if (lo == hi) { tree[node] = a[lo]; return; }
    int mid = (lo + hi) / 2;
    seg_build(tree, a, 2 * node + 1, lo, mid);
    seg_build(tree, a, 2 * node + 2, mid + 1, hi);
    tree[node] = min2(tree[2 * node + 1], tree[2 * node + 2]);
}

int seg_min(int* tree, int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return SEG_INF;
    if (l <= lo && hi <= r) return tree[node];
    int mid = (lo + hi) / 2;
    return min2(seg_min(tree, 2 * node + 1, lo, mid, l, r),
                seg_min(tree, 2 * node + 2, mid + 1, hi, l, r));
}

SegTree* seg_new(const int* a, int n) {
    SegTree* st = (SegTree*)malloc(sizeof(SegTree));
    st->n = n;
    st->tree = (int*)malloc(sizeof(int) * 4 * n);
    seg_build(st->tree, a, 0, 0, n - 1);
    return st;
}

int range_min(SegTree* st, int l, int r) {
    return seg_min(st->tree, 0, 0, st->n - 1, l, r);
}`,
    `struct MinSegTree {
    static const int INF = 1000000000;
    int n;
    vector<int> tree;

    explicit MinSegTree(const vector<int>& a) : n((int)a.size()), tree(4 * a.size(), INF) {
        if (n > 0) build(a, 0, 0, n - 1);
    }

    void build(const vector<int>& a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = min(tree[2 * node + 1], tree[2 * node + 2]);
    }

    int query(int node, int lo, int hi, int l, int r) const {
        if (r < lo || hi < l) return INF;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return min(query(2 * node + 1, lo, mid, l, r),
                   query(2 * node + 2, mid + 1, hi, l, r));
    }

    int range_min(int l, int r) const { return query(0, 0, n - 1, l, r); }
};`,
    `INF = float("inf")


class MinSegTree:
    def __init__(self, values):
        self.n = len(values)
        self.tree = [INF] * (4 * max(self.n, 1))
        if self.n:
            self.build(values, 0, 0, self.n - 1)

    def build(self, a, node, lo, hi):
        if lo == hi:
            self.tree[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self.build(a, 2 * node + 1, lo, mid)
        self.build(a, 2 * node + 2, mid + 1, hi)
        self.tree[node] = min(self.tree[2 * node + 1], self.tree[2 * node + 2])

    def query(self, node, lo, hi, left, right):
        if right < lo or hi < left:
            return INF
        if left <= lo and hi <= right:
            return self.tree[node]
        mid = (lo + hi) // 2
        return min(
            self.query(2 * node + 1, lo, mid, left, right),
            self.query(2 * node + 2, mid + 1, hi, left, right),
        )

    def range_min(self, left, right):
        return self.query(0, 0, self.n - 1, left, right) if self.n else INF`,
    `class MinSegTree {
    static final int INF = Integer.MAX_VALUE;
    final int n;
    final int[] tree;

    MinSegTree(int[] a) {
        n = a.length;
        tree = new int[4 * Math.max(n, 1)];
        Arrays.fill(tree, INF);
        if (n > 0) build(a, 0, 0, n - 1);
    }

    private void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = Math.min(tree[2 * node + 1], tree[2 * node + 2]);
    }

    private int query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return INF;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return Math.min(query(2 * node + 1, lo, mid, l, r),
                        query(2 * node + 2, mid + 1, hi, l, r));
    }

    int rangeMin(int l, int r) { return n == 0 ? INF : query(0, 0, n - 1, l, r); }
}`,
    `class MinSegTree {
  constructor(values) {
    this.n = values.length;
    this.tree = new Array(4 * Math.max(this.n, 1)).fill(Infinity);
    if (this.n) this.build(values, 0, 0, this.n - 1);
  }

  build(a, node, lo, hi) {
    if (lo === hi) {
      this.tree[node] = a[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(a, 2 * node + 1, lo, mid);
    this.build(a, 2 * node + 2, mid + 1, hi);
    this.tree[node] = Math.min(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  query(node, lo, hi, l, r) {
    if (r < lo || hi < l) return Infinity;
    if (l <= lo && hi <= r) return this.tree[node];
    const mid = (lo + hi) >> 1;
    return Math.min(
      this.query(2 * node + 1, lo, mid, l, r),
      this.query(2 * node + 2, mid + 1, hi, l, r),
    );
  }

  rangeMin(l, r) {
    return this.n ? this.query(0, 0, this.n - 1, l, r) : Infinity;
  }
}`,
    `class MinSegTree {
    const int INF = int.MaxValue;
    readonly int n;
    readonly int[] tree;

    public MinSegTree(int[] a) {
        n = a.Length;
        tree = new int[4 * Math.Max(n, 1)];
        Array.Fill(tree, INF);
        if (n > 0) Build(a, 0, 0, n - 1);
    }

    void Build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        Build(a, 2 * node + 1, lo, mid);
        Build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = Math.Min(tree[2 * node + 1], tree[2 * node + 2]);
    }

    int Query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return INF;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return Math.Min(Query(2 * node + 1, lo, mid, l, r),
                        Query(2 * node + 2, mid + 1, hi, l, r));
    }

    public int RangeMin(int l, int r) => n == 0 ? INF : Query(0, 0, n - 1, l, r);
}`,
  ),

  "seg-range-max": snippets(
    `#define SEG_NEG_INF (-1000000000)

typedef struct { int* tree; int n; } SegTree;

static int max2(int a, int b) { return a > b ? a : b; }

void seg_build(int* tree, const int* a, int node, int lo, int hi) {
    if (lo == hi) { tree[node] = a[lo]; return; }
    int mid = (lo + hi) / 2;
    seg_build(tree, a, 2 * node + 1, lo, mid);
    seg_build(tree, a, 2 * node + 2, mid + 1, hi);
    tree[node] = max2(tree[2 * node + 1], tree[2 * node + 2]);
}

int seg_max(int* tree, int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return SEG_NEG_INF;
    if (l <= lo && hi <= r) return tree[node];
    int mid = (lo + hi) / 2;
    return max2(seg_max(tree, 2 * node + 1, lo, mid, l, r),
                seg_max(tree, 2 * node + 2, mid + 1, hi, l, r));
}

SegTree* seg_new(const int* a, int n) {
    SegTree* st = (SegTree*)malloc(sizeof(SegTree));
    st->n = n;
    st->tree = (int*)malloc(sizeof(int) * 4 * n);
    seg_build(st->tree, a, 0, 0, n - 1);
    return st;
}

int range_max(SegTree* st, int l, int r) {
    return seg_max(st->tree, 0, 0, st->n - 1, l, r);
}`,
    `struct MaxSegTree {
    static const int NEG_INF = -1000000000;
    int n;
    vector<int> tree;

    explicit MaxSegTree(const vector<int>& a)
        : n((int)a.size()), tree(4 * a.size(), NEG_INF) {
        if (n > 0) build(a, 0, 0, n - 1);
    }

    void build(const vector<int>& a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = max(tree[2 * node + 1], tree[2 * node + 2]);
    }

    int query(int node, int lo, int hi, int l, int r) const {
        if (r < lo || hi < l) return NEG_INF;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return max(query(2 * node + 1, lo, mid, l, r),
                   query(2 * node + 2, mid + 1, hi, l, r));
    }

    int range_max(int l, int r) const { return query(0, 0, n - 1, l, r); }
};`,
    `NEG_INF = float("-inf")


class MaxSegTree:
    def __init__(self, values):
        self.n = len(values)
        self.tree = [NEG_INF] * (4 * max(self.n, 1))
        if self.n:
            self.build(values, 0, 0, self.n - 1)

    def build(self, a, node, lo, hi):
        if lo == hi:
            self.tree[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self.build(a, 2 * node + 1, lo, mid)
        self.build(a, 2 * node + 2, mid + 1, hi)
        self.tree[node] = max(self.tree[2 * node + 1], self.tree[2 * node + 2])

    def query(self, node, lo, hi, left, right):
        if right < lo or hi < left:
            return NEG_INF
        if left <= lo and hi <= right:
            return self.tree[node]
        mid = (lo + hi) // 2
        return max(
            self.query(2 * node + 1, lo, mid, left, right),
            self.query(2 * node + 2, mid + 1, hi, left, right),
        )

    def range_max(self, left, right):
        return self.query(0, 0, self.n - 1, left, right) if self.n else NEG_INF`,
    `class MaxSegTree {
    static final int NEG_INF = Integer.MIN_VALUE;
    final int n;
    final int[] tree;

    MaxSegTree(int[] a) {
        n = a.length;
        tree = new int[4 * Math.max(n, 1)];
        Arrays.fill(tree, NEG_INF);
        if (n > 0) build(a, 0, 0, n - 1);
    }

    private void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = Math.max(tree[2 * node + 1], tree[2 * node + 2]);
    }

    private int query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return NEG_INF;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return Math.max(query(2 * node + 1, lo, mid, l, r),
                        query(2 * node + 2, mid + 1, hi, l, r));
    }

    int rangeMax(int l, int r) { return n == 0 ? NEG_INF : query(0, 0, n - 1, l, r); }
}`,
    `class MaxSegTree {
  constructor(values) {
    this.n = values.length;
    this.tree = new Array(4 * Math.max(this.n, 1)).fill(-Infinity);
    if (this.n) this.build(values, 0, 0, this.n - 1);
  }

  build(a, node, lo, hi) {
    if (lo === hi) {
      this.tree[node] = a[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(a, 2 * node + 1, lo, mid);
    this.build(a, 2 * node + 2, mid + 1, hi);
    this.tree[node] = Math.max(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  query(node, lo, hi, l, r) {
    if (r < lo || hi < l) return -Infinity;
    if (l <= lo && hi <= r) return this.tree[node];
    const mid = (lo + hi) >> 1;
    return Math.max(
      this.query(2 * node + 1, lo, mid, l, r),
      this.query(2 * node + 2, mid + 1, hi, l, r),
    );
  }

  rangeMax(l, r) {
    return this.n ? this.query(0, 0, this.n - 1, l, r) : -Infinity;
  }
}`,
    `class MaxSegTree {
    const int NEG_INF = int.MinValue;
    readonly int n;
    readonly int[] tree;

    public MaxSegTree(int[] a) {
        n = a.Length;
        tree = new int[4 * Math.Max(n, 1)];
        Array.Fill(tree, NEG_INF);
        if (n > 0) Build(a, 0, 0, n - 1);
    }

    void Build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        Build(a, 2 * node + 1, lo, mid);
        Build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = Math.Max(tree[2 * node + 1], tree[2 * node + 2]);
    }

    int Query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return NEG_INF;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return Math.Max(Query(2 * node + 1, lo, mid, l, r),
                        Query(2 * node + 2, mid + 1, hi, l, r));
    }

    public int RangeMax(int l, int r) => n == 0 ? NEG_INF : Query(0, 0, n - 1, l, r);
}`,
  ),

  "seg-point-update": snippets(
    `typedef struct { int* tree; int n; } SegTree;

void seg_build(int* tree, const int* a, int node, int lo, int hi) {
    if (lo == hi) { tree[node] = a[lo]; return; }
    int mid = (lo + hi) / 2;
    seg_build(tree, a, 2 * node + 1, lo, mid);
    seg_build(tree, a, 2 * node + 2, mid + 1, hi);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}

void seg_update(int* tree, int node, int lo, int hi, int idx, int value) {
    if (lo == hi) { tree[node] = value; return; }
    int mid = (lo + hi) / 2;
    if (idx <= mid) seg_update(tree, 2 * node + 1, lo, mid, idx, value);
    else seg_update(tree, 2 * node + 2, mid + 1, hi, idx, value);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}

int seg_sum(int* tree, int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return tree[node];
    int mid = (lo + hi) / 2;
    return seg_sum(tree, 2 * node + 1, lo, mid, l, r)
         + seg_sum(tree, 2 * node + 2, mid + 1, hi, l, r);
}

void point_set(SegTree* st, int idx, int value) {
    seg_update(st->tree, 0, 0, st->n - 1, idx, value);
}`,
    `struct SegTree {
    int n;
    vector<long long> tree;

    explicit SegTree(const vector<int>& a) : n((int)a.size()), tree(4 * a.size(), 0) {
        if (n > 0) build(a, 0, 0, n - 1);
    }

    void build(const vector<int>& a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void update(int node, int lo, int hi, int idx, int value) {
        if (lo == hi) { tree[node] = value; return; }
        int mid = (lo + hi) / 2;
        if (idx <= mid) update(2 * node + 1, lo, mid, idx, value);
        else update(2 * node + 2, mid + 1, hi, idx, value);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void set(int idx, int value) { update(0, 0, n - 1, idx, value); }

    long long query(int node, int lo, int hi, int l, int r) const {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return query(2 * node + 1, lo, mid, l, r)
             + query(2 * node + 2, mid + 1, hi, l, r);
    }

    long long range_sum(int l, int r) const { return query(0, 0, n - 1, l, r); }
};`,
    `class SegTree:
    def __init__(self, values):
        self.n = len(values)
        self.tree = [0] * (4 * max(self.n, 1))
        if self.n:
            self.build(values, 0, 0, self.n - 1)

    def build(self, a, node, lo, hi):
        if lo == hi:
            self.tree[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self.build(a, 2 * node + 1, lo, mid)
        self.build(a, 2 * node + 2, mid + 1, hi)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def update(self, node, lo, hi, idx, value):
        if lo == hi:
            self.tree[node] = value
            return
        mid = (lo + hi) // 2
        if idx <= mid:
            self.update(2 * node + 1, lo, mid, idx, value)
        else:
            self.update(2 * node + 2, mid + 1, hi, idx, value)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def __setitem__(self, idx, value):
        self.update(0, 0, self.n - 1, idx, value)

    def query(self, node, lo, hi, left, right):
        if right < lo or hi < left:
            return 0
        if left <= lo and hi <= right:
            return self.tree[node]
        mid = (lo + hi) // 2
        return self.query(2 * node + 1, lo, mid, left, right) + self.query(
            2 * node + 2, mid + 1, hi, left, right
        )

    def range_sum(self, left, right):
        return self.query(0, 0, self.n - 1, left, right)`,
    `class SegTree {
    final int n;
    final long[] tree;

    SegTree(int[] a) {
        n = a.length;
        tree = new long[4 * Math.max(n, 1)];
        if (n > 0) build(a, 0, 0, n - 1);
    }

    private void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    private void update(int node, int lo, int hi, int idx, int value) {
        if (lo == hi) { tree[node] = value; return; }
        int mid = (lo + hi) / 2;
        if (idx <= mid) update(2 * node + 1, lo, mid, idx, value);
        else update(2 * node + 2, mid + 1, hi, idx, value);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void set(int idx, int value) { update(0, 0, n - 1, idx, value); }

    private long query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return query(2 * node + 1, lo, mid, l, r)
             + query(2 * node + 2, mid + 1, hi, l, r);
    }

    long rangeSum(int l, int r) { return query(0, 0, n - 1, l, r); }
}`,
    `class SegTree {
  constructor(values) {
    this.n = values.length;
    this.tree = new Array(4 * Math.max(this.n, 1)).fill(0);
    if (this.n) this.build(values, 0, 0, this.n - 1);
  }

  build(a, node, lo, hi) {
    if (lo === hi) {
      this.tree[node] = a[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(a, 2 * node + 1, lo, mid);
    this.build(a, 2 * node + 2, mid + 1, hi);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  update(node, lo, hi, idx, value) {
    if (lo === hi) {
      this.tree[node] = value;
      return;
    }
    const mid = (lo + hi) >> 1;
    if (idx <= mid) this.update(2 * node + 1, lo, mid, idx, value);
    else this.update(2 * node + 2, mid + 1, hi, idx, value);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  set(idx, value) {
    this.update(0, 0, this.n - 1, idx, value);
    return this;
  }

  query(node, lo, hi, l, r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return this.tree[node];
    const mid = (lo + hi) >> 1;
    return (
      this.query(2 * node + 1, lo, mid, l, r) +
      this.query(2 * node + 2, mid + 1, hi, l, r)
    );
  }

  rangeSum(l, r) {
    return this.query(0, 0, this.n - 1, l, r);
  }
}`,
    `class SegTree {
    readonly int n;
    readonly long[] tree;

    public SegTree(int[] a) {
        n = a.Length;
        tree = new long[4 * Math.Max(n, 1)];
        if (n > 0) Build(a, 0, 0, n - 1);
    }

    void Build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        Build(a, 2 * node + 1, lo, mid);
        Build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void Update(int node, int lo, int hi, int idx, int value) {
        if (lo == hi) { tree[node] = value; return; }
        int mid = (lo + hi) / 2;
        if (idx <= mid) Update(2 * node + 1, lo, mid, idx, value);
        else Update(2 * node + 2, mid + 1, hi, idx, value);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    public void Set(int idx, int value) => Update(0, 0, n - 1, idx, value);

    long Query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        int mid = (lo + hi) / 2;
        return Query(2 * node + 1, lo, mid, l, r)
             + Query(2 * node + 2, mid + 1, hi, l, r);
    }

    public long RangeSum(int l, int r) => Query(0, 0, n - 1, l, r);
}`,
  ),

  "seg-range-update": snippets(
    `typedef struct { long long* tree; long long* lazy; int n; } LazySeg;

LazySeg* lazy_new(const int* a, int n);

void push_down(LazySeg* st, int node, int lo, int hi) {
    if (st->lazy[node] == 0) return;
    long long add = st->lazy[node];
    int mid = (lo + hi) / 2;
    int left = 2 * node + 1, right = 2 * node + 2;
    st->tree[left] += add * (mid - lo + 1);
    st->tree[right] += add * (hi - mid);
    st->lazy[left] += add;
    st->lazy[right] += add;
    st->lazy[node] = 0;
}

void range_add(LazySeg* st, int node, int lo, int hi, int l, int r, long long add) {
    if (r < lo || hi < l) return;
    if (l <= lo && hi <= r) {
        st->tree[node] += add * (hi - lo + 1);
        st->lazy[node] += add;
        return;
    }
    push_down(st, node, lo, hi);
    int mid = (lo + hi) / 2;
    range_add(st, 2 * node + 1, lo, mid, l, r, add);
    range_add(st, 2 * node + 2, mid + 1, hi, l, r, add);
    st->tree[node] = st->tree[2 * node + 1] + st->tree[2 * node + 2];
}

long long range_sum(LazySeg* st, int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return st->tree[node];
    push_down(st, node, lo, hi);
    int mid = (lo + hi) / 2;
    return range_sum(st, 2 * node + 1, lo, mid, l, r)
         + range_sum(st, 2 * node + 2, mid + 1, hi, l, r);
}

LazySeg* lazy_new(const int* a, int n) {
    LazySeg* st = (LazySeg*)malloc(sizeof(LazySeg));
    st->n = n;
    st->tree = (long long*)calloc(4 * n, sizeof(long long));
    st->lazy = (long long*)calloc(4 * n, sizeof(long long));
    for (int i = 0; i < n; i++) range_add(st, 0, 0, n - 1, i, i, a[i]);
    return st;
}`,
    `struct LazySeg {
    int n;
    vector<long long> tree, lazy;

    explicit LazySeg(const vector<int>& a)
        : n((int)a.size()), tree(4 * a.size(), 0), lazy(4 * a.size(), 0) {
        if (n > 0) build(a, 0, 0, n - 1);
    }

    void build(const vector<int>& a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void push_down(int node, int lo, int hi) {
        if (lazy[node] == 0) return;
        int mid = (lo + hi) / 2, l = 2 * node + 1, r = 2 * node + 2;
        long long add = lazy[node];
        tree[l] += add * (mid - lo + 1);
        tree[r] += add * (hi - mid);
        lazy[l] += add;
        lazy[r] += add;
        lazy[node] = 0;
    }

    void range_add(int node, int lo, int hi, int l, int r, long long add) {
        if (r < lo || hi < l) return;
        if (l <= lo && hi <= r) {
            tree[node] += add * (hi - lo + 1);
            lazy[node] += add;
            return;
        }
        push_down(node, lo, hi);
        int mid = (lo + hi) / 2;
        range_add(2 * node + 1, lo, mid, l, r, add);
        range_add(2 * node + 2, mid + 1, hi, l, r, add);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long long range_sum(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        push_down(node, lo, hi);
        int mid = (lo + hi) / 2;
        return range_sum(2 * node + 1, lo, mid, l, r)
             + range_sum(2 * node + 2, mid + 1, hi, l, r);
    }

    void add(int l, int r, long long v) { range_add(0, 0, n - 1, l, r, v); }
    long long sum(int l, int r) { return range_sum(0, 0, n - 1, l, r); }
};`,
    `class LazySegTree:
    def __init__(self, values):
        self.n = len(values)
        size = 4 * max(self.n, 1)
        self.tree = [0] * size
        self.lazy = [0] * size
        if self.n:
            self.build(values, 0, 0, self.n - 1)

    def build(self, a, node, lo, hi):
        if lo == hi:
            self.tree[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self.build(a, 2 * node + 1, lo, mid)
        self.build(a, 2 * node + 2, mid + 1, hi)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def push_down(self, node, lo, hi):
        add = self.lazy[node]
        if add == 0:
            return
        mid = (lo + hi) // 2
        left, right = 2 * node + 1, 2 * node + 2
        self.tree[left] += add * (mid - lo + 1)
        self.tree[right] += add * (hi - mid)
        self.lazy[left] += add
        self.lazy[right] += add
        self.lazy[node] = 0

    def range_add(self, node, lo, hi, left, right, add):
        if right < lo or hi < left:
            return
        if left <= lo and hi <= right:
            self.tree[node] += add * (hi - lo + 1)
            self.lazy[node] += add
            return
        self.push_down(node, lo, hi)
        mid = (lo + hi) // 2
        self.range_add(2 * node + 1, lo, mid, left, right, add)
        self.range_add(2 * node + 2, mid + 1, hi, left, right, add)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def range_sum(self, node, lo, hi, left, right):
        if right < lo or hi < left:
            return 0
        if left <= lo and hi <= right:
            return self.tree[node]
        self.push_down(node, lo, hi)
        mid = (lo + hi) // 2
        return self.range_sum(2 * node + 1, lo, mid, left, right) + self.range_sum(
            2 * node + 2, mid + 1, hi, left, right
        )

    def add(self, left, right, value):
        self.range_add(0, 0, self.n - 1, left, right, value)

    def sum(self, left, right):
        return self.range_sum(0, 0, self.n - 1, left, right)`,
    `class LazySegTree {
    final int n;
    final long[] tree, lazy;

    LazySegTree(int[] a) {
        n = a.length;
        int size = 4 * Math.max(n, 1);
        tree = new long[size];
        lazy = new long[size];
        if (n > 0) build(a, 0, 0, n - 1);
    }

    private void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node + 1, lo, mid);
        build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    private void pushDown(int node, int lo, int hi) {
        long add = lazy[node];
        if (add == 0) return;
        int mid = (lo + hi) / 2, l = 2 * node + 1, r = 2 * node + 2;
        tree[l] += add * (mid - lo + 1);
        tree[r] += add * (hi - mid);
        lazy[l] += add;
        lazy[r] += add;
        lazy[node] = 0;
    }

    private void rangeAdd(int node, int lo, int hi, int l, int r, long add) {
        if (r < lo || hi < l) return;
        if (l <= lo && hi <= r) {
            tree[node] += add * (hi - lo + 1);
            lazy[node] += add;
            return;
        }
        pushDown(node, lo, hi);
        int mid = (lo + hi) / 2;
        rangeAdd(2 * node + 1, lo, mid, l, r, add);
        rangeAdd(2 * node + 2, mid + 1, hi, l, r, add);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    private long rangeSum(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        pushDown(node, lo, hi);
        int mid = (lo + hi) / 2;
        return rangeSum(2 * node + 1, lo, mid, l, r)
             + rangeSum(2 * node + 2, mid + 1, hi, l, r);
    }

    void add(int l, int r, long value) { rangeAdd(0, 0, n - 1, l, r, value); }
    long sum(int l, int r) { return rangeSum(0, 0, n - 1, l, r); }
}`,
    `class LazySegTree {
  constructor(values) {
    this.n = values.length;
    const size = 4 * Math.max(this.n, 1);
    this.tree = new Array(size).fill(0);
    this.lazy = new Array(size).fill(0);
    if (this.n) this.build(values, 0, 0, this.n - 1);
  }

  build(a, node, lo, hi) {
    if (lo === hi) {
      this.tree[node] = a[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(a, 2 * node + 1, lo, mid);
    this.build(a, 2 * node + 2, mid + 1, hi);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  pushDown(node, lo, hi) {
    const add = this.lazy[node];
    if (add === 0) return;
    const mid = (lo + hi) >> 1;
    const l = 2 * node + 1;
    const r = 2 * node + 2;
    this.tree[l] += add * (mid - lo + 1);
    this.tree[r] += add * (hi - mid);
    this.lazy[l] += add;
    this.lazy[r] += add;
    this.lazy[node] = 0;
  }

  rangeAdd(node, lo, hi, l, r, add) {
    if (r < lo || hi < l) return;
    if (l <= lo && hi <= r) {
      this.tree[node] += add * (hi - lo + 1);
      this.lazy[node] += add;
      return;
    }
    this.pushDown(node, lo, hi);
    const mid = (lo + hi) >> 1;
    this.rangeAdd(2 * node + 1, lo, mid, l, r, add);
    this.rangeAdd(2 * node + 2, mid + 1, hi, l, r, add);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  rangeSum(node, lo, hi, l, r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return this.tree[node];
    this.pushDown(node, lo, hi);
    const mid = (lo + hi) >> 1;
    return (
      this.rangeSum(2 * node + 1, lo, mid, l, r) +
      this.rangeSum(2 * node + 2, mid + 1, hi, l, r)
    );
  }

  add(l, r, value) {
    this.rangeAdd(0, 0, this.n - 1, l, r, value);
    return this;
  }

  sum(l, r) {
    return this.rangeSum(0, 0, this.n - 1, l, r);
  }
}`,
    `class LazySegTree {
    readonly int n;
    readonly long[] tree, lazy;

    public LazySegTree(int[] a) {
        n = a.Length;
        int size = 4 * Math.Max(n, 1);
        tree = new long[size];
        lazy = new long[size];
        if (n > 0) Build(a, 0, 0, n - 1);
    }

    void Build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        Build(a, 2 * node + 1, lo, mid);
        Build(a, 2 * node + 2, mid + 1, hi);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void PushDown(int node, int lo, int hi) {
        long add = lazy[node];
        if (add == 0) return;
        int mid = (lo + hi) / 2, l = 2 * node + 1, r = 2 * node + 2;
        tree[l] += add * (mid - lo + 1);
        tree[r] += add * (hi - mid);
        lazy[l] += add;
        lazy[r] += add;
        lazy[node] = 0;
    }

    void RangeAdd(int node, int lo, int hi, int l, int r, long add) {
        if (r < lo || hi < l) return;
        if (l <= lo && hi <= r) {
            tree[node] += add * (hi - lo + 1);
            lazy[node] += add;
            return;
        }
        PushDown(node, lo, hi);
        int mid = (lo + hi) / 2;
        RangeAdd(2 * node + 1, lo, mid, l, r, add);
        RangeAdd(2 * node + 2, mid + 1, hi, l, r, add);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long RangeSumOf(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        PushDown(node, lo, hi);
        int mid = (lo + hi) / 2;
        return RangeSumOf(2 * node + 1, lo, mid, l, r)
             + RangeSumOf(2 * node + 2, mid + 1, hi, l, r);
    }

    public void Add(int l, int r, long value) => RangeAdd(0, 0, n - 1, l, r, value);
    public long Sum(int l, int r) => RangeSumOf(0, 0, n - 1, l, r);
}`,
  ),

  "nary-tree": snippets(
    `typedef struct NTree {
    int key;
    struct NTree** kids;
    int count, cap;
} NTree;

NTree* ntree_new(int key) {
    NTree* n = (NTree*)malloc(sizeof(NTree));
    n->key = key; n->count = 0; n->cap = 4;
    n->kids = (NTree**)malloc(sizeof(NTree*) * n->cap);
    return n;
}

void ntree_add(NTree* parent, NTree* child) {
    if (parent->count == parent->cap) {
        parent->cap *= 2;
        parent->kids = (NTree**)realloc(parent->kids, sizeof(NTree*) * parent->cap);
    }
    parent->kids[parent->count++] = child;
}

void ntree_preorder(NTree* n, int* out, int* k) {
    if (!n) return;
    out[(*k)++] = n->key;
    for (int i = 0; i < n->count; i++) ntree_preorder(n->kids[i], out, k);
}

int ntree_height(NTree* n) {
    if (!n) return -1;
    int best = -1;
    for (int i = 0; i < n->count; i++) {
        int h = ntree_height(n->kids[i]);
        if (h > best) best = h;
    }
    return best + 1;
}

NTree* ntree_find(NTree* n, int key) {
    if (!n) return NULL;
    if (n->key == key) return n;
    for (int i = 0; i < n->count; i++) {
        NTree* hit = ntree_find(n->kids[i], key);
        if (hit) return hit;
    }
    return NULL;
}`,
    `struct NTree {
    int key;
    vector<NTree*> kids;
    explicit NTree(int k) : key(k) {}

    NTree* add(int child_key) {
        NTree* kid = new NTree(child_key);
        kids.push_back(kid);
        return kid;
    }
};

void preorder(NTree* n, vector<int>& out) {
    if (!n) return;
    out.push_back(n->key);
    for (NTree* kid : n->kids) preorder(kid, out);
}

vector<int> level_order(NTree* root) {
    vector<int> out;
    if (!root) return out;
    queue<NTree*> q;
    q.push(root);
    while (!q.empty()) {
        NTree* n = q.front(); q.pop();
        out.push_back(n->key);
        for (NTree* kid : n->kids) q.push(kid);
    }
    return out;
}

int height(NTree* n) {
    if (!n) return -1;
    int best = -1;
    for (NTree* kid : n->kids) best = max(best, height(kid));
    return best + 1;
}

NTree* find(NTree* n, int key) {
    if (!n) return nullptr;
    if (n->key == key) return n;
    for (NTree* kid : n->kids) {
        if (NTree* hit = find(kid, key)) return hit;
    }
    return nullptr;
}`,
    `from collections import deque


class NTree:
    def __init__(self, key):
        self.key = key
        self.kids = []

    def add(self, key):
        kid = NTree(key)
        self.kids.append(kid)
        return kid

    def preorder(self, out=None):
        out = [] if out is None else out
        out.append(self.key)
        for kid in self.kids:
            kid.preorder(out)
        return out

    def level_order(self):
        out, q = [], deque([self])
        while q:
            node = q.popleft()
            out.append(node.key)
            q.extend(node.kids)
        return out

    def height(self):
        return 1 + max((kid.height() for kid in self.kids), default=-1)

    def find(self, key):
        if self.key == key:
            return self
        for kid in self.kids:
            hit = kid.find(key)
            if hit:
                return hit
        return None`,
    `class NTree {
    int key;
    List<NTree> kids = new ArrayList<>();

    NTree(int key) { this.key = key; }

    NTree add(int childKey) {
        NTree kid = new NTree(childKey);
        kids.add(kid);
        return kid;
    }

    void preorder(List<Integer> out) {
        out.add(key);
        for (NTree kid : kids) kid.preorder(out);
    }

    List<Integer> levelOrder() {
        List<Integer> out = new ArrayList<>();
        Queue<NTree> q = new ArrayDeque<>();
        q.add(this);
        while (!q.isEmpty()) {
            NTree n = q.remove();
            out.add(n.key);
            q.addAll(n.kids);
        }
        return out;
    }

    int height() {
        int best = -1;
        for (NTree kid : kids) best = Math.max(best, kid.height());
        return best + 1;
    }

    NTree find(int target) {
        if (key == target) return this;
        for (NTree kid : kids) {
            NTree hit = kid.find(target);
            if (hit != null) return hit;
        }
        return null;
    }
}`,
    `class NTree {
  constructor(key) {
    this.key = key;
    this.kids = [];
  }

  add(key) {
    const kid = new NTree(key);
    this.kids.push(kid);
    return kid;
  }

  preorder(out = []) {
    out.push(this.key);
    for (const kid of this.kids) kid.preorder(out);
    return out;
  }

  levelOrder() {
    const out = [];
    const q = [this];
    let head = 0;
    while (head < q.length) {
      const n = q[head++];
      out.push(n.key);
      q.push(...n.kids);
    }
    return out;
  }

  height() {
    return 1 + Math.max(-1, ...this.kids.map((kid) => kid.height()));
  }

  find(key) {
    if (this.key === key) return this;
    for (const kid of this.kids) {
      const hit = kid.find(key);
      if (hit) return hit;
    }
    return null;
  }
}`,
    `class NTree {
    public int Key { get; }
    public List<NTree> Kids { get; } = new();

    public NTree(int key) { Key = key; }

    public NTree Add(int childKey) {
        var kid = new NTree(childKey);
        Kids.Add(kid);
        return kid;
    }

    public void Preorder(List<int> acc) {
        acc.Add(Key);
        foreach (NTree kid in Kids) kid.Preorder(acc);
    }

    public List<int> LevelOrder() {
        var acc = new List<int>();
        var q = new Queue<NTree>();
        q.Enqueue(this);
        while (q.Count > 0) {
            NTree n = q.Dequeue();
            acc.Add(n.Key);
            foreach (NTree kid in n.Kids) q.Enqueue(kid);
        }
        return acc;
    }

    public int Height() {
        int best = -1;
        foreach (NTree kid in Kids) best = Math.Max(best, kid.Height());
        return best + 1;
    }

    public NTree? Find(int key) {
        if (Key == key) return this;
        foreach (NTree kid in Kids) {
            NTree? hit = kid.Find(key);
            if (hit != null) return hit;
        }
        return null;
    }
}`,
  ),

  "kary-tree": snippets(
    `typedef struct KNode {
    int key;
    int k;
    struct KNode** kids;
} KNode;

KNode* knode_new(int key, int k) {
    KNode* n = (KNode*)malloc(sizeof(KNode));
    n->key = key; n->k = k;
    n->kids = (KNode**)calloc(k, sizeof(KNode*));
    return n;
}

/* array-backed index math for a complete k-ary tree */
int child_index(int i, int j, int k) { return k * i + j + 1; }
int parent_index(int i, int k) { return (i - 1) / k; }

/* fill the first free slot in level order */
void kary_insert(KNode* root, int key) {
    KNode* q[256];
    int head = 0, tail = 0;
    q[tail++] = root;
    while (head < tail) {
        KNode* n = q[head++];
        for (int j = 0; j < n->k; j++) {
            if (!n->kids[j]) { n->kids[j] = knode_new(key, n->k); return; }
            q[tail++] = n->kids[j];
        }
    }
}

int kary_height(KNode* n) {
    if (!n) return -1;
    int best = -1;
    for (int j = 0; j < n->k; j++) {
        int h = kary_height(n->kids[j]);
        if (h > best) best = h;
    }
    return best + 1;
}`,
    `struct KNode {
    int key;
    vector<KNode*> kids;
    KNode(int key_, int k) : key(key_), kids(k, nullptr) {}
};

struct KaryTree {
    int k;
    KNode* root = nullptr;

    explicit KaryTree(int arity) : k(arity) {}

    // index math for the array-backed layout
    static int child_index(int i, int j, int k) { return k * i + j + 1; }
    static int parent_index(int i, int k) { return (i - 1) / k; }

    void insert(int key) {
        if (!root) { root = new KNode(key, k); return; }
        queue<KNode*> q;
        q.push(root);
        while (!q.empty()) {
            KNode* n = q.front(); q.pop();
            for (int j = 0; j < k; j++) {
                if (!n->kids[j]) { n->kids[j] = new KNode(key, k); return; }
                q.push(n->kids[j]);
            }
        }
    }

    int height(KNode* n) const {
        if (!n) return -1;
        int best = -1;
        for (KNode* kid : n->kids) best = max(best, height(kid));
        return best + 1;
    }
};`,
    `from collections import deque


class KNode:
    def __init__(self, key, k):
        self.key = key
        self.k = k
        self.kids = [None] * k


class KaryTree:
    def __init__(self, k):
        self.k = k
        self.root = None

    def child_index(self, i, j):
        return self.k * i + j + 1

    def parent_index(self, i):
        return (i - 1) // self.k

    def insert(self, key):
        if self.root is None:
            self.root = KNode(key, self.k)
            return self
        q = deque([self.root])
        while q:
            node = q.popleft()
            for j in range(self.k):
                if node.kids[j] is None:
                    node.kids[j] = KNode(key, self.k)
                    return self
                q.append(node.kids[j])
        return self

    def height(self, node=None, top=True):
        node = self.root if top else node
        if node is None:
            return -1
        kids = [self.height(kid, False) for kid in node.kids]
        return 1 + max(kids, default=-1)`,
    `class KNode {
    int key;
    KNode[] kids;
    KNode(int key, int k) { this.key = key; kids = new KNode[k]; }
}

class KaryTree {
    final int k;
    KNode root;

    KaryTree(int k) { this.k = k; }

    // array-backed index math
    int childIndex(int i, int j) { return k * i + j + 1; }
    int parentIndex(int i) { return (i - 1) / k; }

    void insert(int key) {
        if (root == null) { root = new KNode(key, k); return; }
        Queue<KNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            KNode n = q.remove();
            for (int j = 0; j < k; j++) {
                if (n.kids[j] == null) { n.kids[j] = new KNode(key, k); return; }
                q.add(n.kids[j]);
            }
        }
    }

    int height(KNode n) {
        if (n == null) return -1;
        int best = -1;
        for (KNode kid : n.kids) best = Math.max(best, height(kid));
        return best + 1;
    }
}`,
    `class KNode {
  constructor(key, k) {
    this.key = key;
    this.k = k;
    this.kids = new Array(k).fill(null);
  }
}

class KaryTree {
  constructor(k) {
    this.k = k;
    this.root = null;
  }

  childIndex(i, j) {
    return this.k * i + j + 1;
  }

  parentIndex(i) {
    return Math.floor((i - 1) / this.k);
  }

  insert(key) {
    if (!this.root) {
      this.root = new KNode(key, this.k);
      return this;
    }
    const q = [this.root];
    let head = 0;
    while (head < q.length) {
      const n = q[head++];
      for (let j = 0; j < this.k; j++) {
        if (!n.kids[j]) {
          n.kids[j] = new KNode(key, this.k);
          return this;
        }
        q.push(n.kids[j]);
      }
    }
    return this;
  }

  height(node = this.root) {
    if (!node) return -1;
    return 1 + Math.max(-1, ...node.kids.map((kid) => this.height(kid)));
  }
}`,
    `class KNode {
    public int Key { get; }
    public KNode?[] Kids { get; }
    public KNode(int key, int k) { Key = key; Kids = new KNode?[k]; }
}

class KaryTree {
    readonly int k;
    public KNode? Root { get; private set; }

    public KaryTree(int arity) { k = arity; }

    // array-backed index math
    public int ChildIndex(int i, int j) => k * i + j + 1;
    public int ParentIndex(int i) => (i - 1) / k;

    public void Insert(int key) {
        if (Root == null) { Root = new KNode(key, k); return; }
        var q = new Queue<KNode>();
        q.Enqueue(Root);
        while (q.Count > 0) {
            KNode n = q.Dequeue();
            for (int j = 0; j < k; j++) {
                if (n.Kids[j] == null) { n.Kids[j] = new KNode(key, k); return; }
                q.Enqueue(n.Kids[j]!);
            }
        }
    }

    public int Height(KNode? n) {
        if (n == null) return -1;
        int best = -1;
        foreach (KNode? kid in n.Kids) best = Math.Max(best, Height(kid));
        return best + 1;
    }
}`,
  ),

  "tt-tree": snippets(
    `typedef struct T23 {
    int keys[2];
    int n;
    struct T23* kids[3];
    int leaf;
} T23;

T23* t23_new(int key, int leaf) {
    T23* t = (T23*)calloc(1, sizeof(T23));
    t->keys[0] = key; t->n = 1; t->leaf = leaf;
    return t;
}

/* returns 1 when the node split: promoted key in *up, new sibling in *right */
int t23_insert(T23* node, int key, int* up, T23** right) {
    if (node->leaf) {
        if (node->n == 1) {
            if (key < node->keys[0]) { node->keys[1] = node->keys[0]; node->keys[0] = key; }
            else node->keys[1] = key;
            node->n = 2;
            return 0;
        }
        int t[3] = { node->keys[0], node->keys[1], key };
        if (t[2] < t[1]) { int s = t[1]; t[1] = t[2]; t[2] = s; }
        if (t[1] < t[0]) { int s = t[0]; t[0] = t[1]; t[1] = s; }
        node->keys[0] = t[0]; node->n = 1;
        *right = t23_new(t[2], 1);
        *up = t[1];
        return 1;
    }
    int i = 0;
    while (i < node->n && key > node->keys[i]) i++;
    int ck = 0;
    T23* cr = NULL;
    if (!t23_insert(node->kids[i], key, &ck, &cr)) return 0;
    if (node->n == 1) {
        if (i == 0) {
            node->keys[1] = node->keys[0]; node->keys[0] = ck;
            node->kids[2] = node->kids[1]; node->kids[1] = cr;
        } else {
            node->keys[1] = ck;
            node->kids[2] = cr;
        }
        node->n = 2;
        return 0;
    }
    int ks[3] = { node->keys[0], node->keys[1], 0 };
    T23* cs[4] = { node->kids[0], node->kids[1], node->kids[2], NULL };
    for (int j = 2; j > i; j--) ks[j] = ks[j - 1];
    ks[i] = ck;
    for (int j = 3; j > i + 1; j--) cs[j] = cs[j - 1];
    cs[i + 1] = cr;
    node->keys[0] = ks[0]; node->n = 1;
    node->kids[0] = cs[0]; node->kids[1] = cs[1]; node->kids[2] = NULL;
    T23* sibling = t23_new(ks[2], 0);
    sibling->kids[0] = cs[2];
    sibling->kids[1] = cs[3];
    *right = sibling;
    *up = ks[1];
    return 1;
}

T23* t23_root_insert(T23* root, int key) {
    if (!root) return t23_new(key, 1);
    int up = 0;
    T23* right = NULL;
    if (t23_insert(root, key, &up, &right)) {
        T23* fresh = t23_new(up, 0);
        fresh->kids[0] = root;
        fresh->kids[1] = right;
        return fresh;
    }
    return root;
}`,
    `struct Node23 {
    vector<int> keys;
    vector<Node23*> kids;
    bool leaf;
    Node23(int key, bool is_leaf) : keys{key}, leaf(is_leaf) {}
};

struct Split {
    bool happened = false;
    int up = 0;
    Node23* right = nullptr;
};

struct TwoThreeTree {
    Node23* root = nullptr;

    void insert(int key) {
        if (!root) { root = new Node23(key, true); return; }
        Split s = insert_into(root, key);
        if (s.happened) {
            Node23* fresh = new Node23(s.up, false);
            fresh->kids = {root, s.right};
            root = fresh;
        }
    }

    Split insert_into(Node23* node, int key) {
        Split out;
        if (node->leaf) {
            node->keys.push_back(key);
            sort(node->keys.begin(), node->keys.end());
            if (node->keys.size() < 3) return out;
            out.happened = true;
            out.up = node->keys[1];
            out.right = new Node23(node->keys[2], true);
            node->keys.resize(1);
            return out;
        }
        size_t i = 0;
        while (i < node->keys.size() && key > node->keys[i]) i++;
        Split child = insert_into(node->kids[i], key);
        if (!child.happened) return out;
        node->keys.insert(node->keys.begin() + i, child.up);
        node->kids.insert(node->kids.begin() + i + 1, child.right);
        if (node->keys.size() < 3) return out;
        out.happened = true;
        out.up = node->keys[1];
        Node23* sibling = new Node23(node->keys[2], false);
        sibling->kids = {node->kids[2], node->kids[3]};
        node->keys.resize(1);
        node->kids.resize(2);
        out.right = sibling;
        return out;
    }
};`,
    `class Node23:
    def __init__(self, key, leaf=True):
        self.keys = [key]
        self.kids = []
        self.leaf = leaf


class TwoThreeTree:
    def __init__(self, values=None):
        self.root = None
        for v in values or []:
            self.insert(v)

    def insert(self, key):
        if self.root is None:
            self.root = Node23(key)
            return self
        split = self._insert(self.root, key)
        if split:
            up, right = split
            fresh = Node23(up, leaf=False)
            fresh.kids = [self.root, right]
            self.root = fresh
        return self

    def _insert(self, node, key):
        """Returns (promoted_key, new_sibling) when the node overflows."""
        if node.leaf:
            node.keys.append(key)
            node.keys.sort()
            if len(node.keys) < 3:
                return None
            left, mid, right = node.keys
            node.keys = [left]
            return mid, Node23(right)
        i = 0
        while i < len(node.keys) and key > node.keys[i]:
            i += 1
        split = self._insert(node.kids[i], key)
        if split is None:
            return None
        up, right = split
        node.keys.insert(i, up)
        node.kids.insert(i + 1, right)
        if len(node.keys) < 3:
            return None
        mid = node.keys[1]
        sibling = Node23(node.keys[2], leaf=False)
        sibling.kids = node.kids[2:]
        node.keys = node.keys[:1]
        node.kids = node.kids[:2]
        return mid, sibling

    def search(self, key):
        node = self.root
        while node:
            if key in node.keys:
                return node
            if node.leaf:
                return None
            i = 0
            while i < len(node.keys) and key > node.keys[i]:
                i += 1
            node = node.kids[i]
        return None`,
    `class Node23 {
    List<Integer> keys = new ArrayList<>();
    List<Node23> kids = new ArrayList<>();
    boolean leaf;

    Node23(int key, boolean leaf) {
        keys.add(key);
        this.leaf = leaf;
    }
}

class Split {
    final int up;
    final Node23 right;
    Split(int up, Node23 right) { this.up = up; this.right = right; }
}

class TwoThreeTree {
    Node23 root;

    void insert(int key) {
        if (root == null) { root = new Node23(key, true); return; }
        Split split = insert(root, key);
        if (split != null) {
            Node23 fresh = new Node23(split.up, false);
            fresh.kids.add(root);
            fresh.kids.add(split.right);
            root = fresh;
        }
    }

    private Split insert(Node23 node, int key) {
        if (node.leaf) {
            node.keys.add(key);
            Collections.sort(node.keys);
            if (node.keys.size() < 3) return null;
            int mid = node.keys.get(1);
            Node23 sibling = new Node23(node.keys.get(2), true);
            node.keys = new ArrayList<>(node.keys.subList(0, 1));
            return new Split(mid, sibling);
        }
        int i = 0;
        while (i < node.keys.size() && key > node.keys.get(i)) i++;
        Split child = insert(node.kids.get(i), key);
        if (child == null) return null;
        node.keys.add(i, child.up);
        node.kids.add(i + 1, child.right);
        if (node.keys.size() < 3) return null;
        int mid = node.keys.get(1);
        Node23 sibling = new Node23(node.keys.get(2), false);
        sibling.kids = new ArrayList<>(node.kids.subList(2, 4));
        node.keys = new ArrayList<>(node.keys.subList(0, 1));
        node.kids = new ArrayList<>(node.kids.subList(0, 2));
        return new Split(mid, sibling);
    }
}`,
    `class Node23 {
  constructor(key, leaf = true) {
    this.keys = [key];
    this.kids = [];
    this.leaf = leaf;
  }
}

class TwoThreeTree {
  constructor(values = []) {
    this.root = null;
    for (const v of values) this.insert(v);
  }

  insert(key) {
    if (!this.root) {
      this.root = new Node23(key);
      return this;
    }
    const split = this.insertInto(this.root, key);
    if (split) {
      const fresh = new Node23(split.up, false);
      fresh.kids = [this.root, split.right];
      this.root = fresh;
    }
    return this;
  }

  // returns { up, right } when the node overflows
  insertInto(node, key) {
    if (node.leaf) {
      node.keys.push(key);
      node.keys.sort((a, b) => a - b);
      if (node.keys.length < 3) return null;
      const [left, mid, right] = node.keys;
      node.keys = [left];
      return { up: mid, right: new Node23(right) };
    }
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;
    const child = this.insertInto(node.kids[i], key);
    if (!child) return null;
    node.keys.splice(i, 0, child.up);
    node.kids.splice(i + 1, 0, child.right);
    if (node.keys.length < 3) return null;
    const mid = node.keys[1];
    const sibling = new Node23(node.keys[2], false);
    sibling.kids = node.kids.slice(2);
    node.keys = node.keys.slice(0, 1);
    node.kids = node.kids.slice(0, 2);
    return { up: mid, right: sibling };
  }

  search(key) {
    let node = this.root;
    while (node) {
      if (node.keys.includes(key)) return node;
      if (node.leaf) return null;
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i++;
      node = node.kids[i];
    }
    return null;
  }
}`,
    `class Node23 {
    public List<int> Keys { get; set; } = new();
    public List<Node23> Kids { get; set; } = new();
    public bool Leaf { get; }

    public Node23(int key, bool leaf) { Keys.Add(key); Leaf = leaf; }
}

class TwoThreeTree {
    public Node23? Root { get; private set; }

    public void Insert(int key) {
        if (Root == null) { Root = new Node23(key, true); return; }
        var split = InsertInto(Root, key);
        if (split != null) {
            var fresh = new Node23(split.Value.Up, false);
            fresh.Kids = new List<Node23> { Root, split.Value.Right };
            Root = fresh;
        }
    }

    (int Up, Node23 Right)? InsertInto(Node23 node, int key) {
        if (node.Leaf) {
            node.Keys.Add(key);
            node.Keys.Sort();
            if (node.Keys.Count < 3) return null;
            int mid = node.Keys[1];
            var sibling = new Node23(node.Keys[2], true);
            node.Keys = node.Keys.GetRange(0, 1);
            return (mid, sibling);
        }
        int i = 0;
        while (i < node.Keys.Count && key > node.Keys[i]) i++;
        var child = InsertInto(node.Kids[i], key);
        if (child == null) return null;
        node.Keys.Insert(i, child.Value.Up);
        node.Kids.Insert(i + 1, child.Value.Right);
        if (node.Keys.Count < 3) return null;
        int promoted = node.Keys[1];
        var right = new Node23(node.Keys[2], false) {
            Kids = node.Kids.GetRange(2, 2),
        };
        node.Keys = node.Keys.GetRange(0, 1);
        node.Kids = node.Kids.GetRange(0, 2);
        return (promoted, right);
    }
}`,
  ),

  "ttf-tree": snippets(
    `#define TTF_MAX 3   /* 2-3-4 tree: up to 3 keys and 4 children */

typedef struct TTF {
    int keys[TTF_MAX];
    int n;
    struct TTF* kids[TTF_MAX + 1];
    int leaf;
} TTF;

TTF* ttf_new(int leaf) {
    TTF* t = (TTF*)calloc(1, sizeof(TTF));
    t->leaf = leaf;
    return t;
}

void ttf_split_child(TTF* parent, int i) {
    TTF* full = parent->kids[i];
    TTF* right = ttf_new(full->leaf);
    int mid = full->keys[1];
    right->keys[0] = full->keys[2];
    right->n = 1;
    if (!full->leaf) {
        right->kids[0] = full->kids[2];
        right->kids[1] = full->kids[3];
    }
    full->n = 1;
    for (int j = parent->n; j > i; j--) {
        parent->keys[j] = parent->keys[j - 1];
        parent->kids[j + 1] = parent->kids[j];
    }
    parent->keys[i] = mid;
    parent->kids[i + 1] = right;
    parent->n++;
}

void ttf_insert_non_full(TTF* node, int key) {
    if (node->leaf) {
        int j = node->n - 1;
        while (j >= 0 && node->keys[j] > key) { node->keys[j + 1] = node->keys[j]; j--; }
        node->keys[j + 1] = key;
        node->n++;
        return;
    }
    int i = 0;
    while (i < node->n && key > node->keys[i]) i++;
    if (node->kids[i]->n == TTF_MAX) {
        ttf_split_child(node, i);
        if (key > node->keys[i]) i++;
    }
    ttf_insert_non_full(node->kids[i], key);
}

TTF* ttf_insert(TTF* root, int key) {
    if (!root) {
        root = ttf_new(1);
        root->keys[0] = key;
        root->n = 1;
        return root;
    }
    if (root->n == TTF_MAX) {
        TTF* fresh = ttf_new(0);
        fresh->kids[0] = root;
        ttf_split_child(fresh, 0);
        root = fresh;
    }
    ttf_insert_non_full(root, key);
    return root;
}`,
    `struct Node234 {
    vector<int> keys;
    vector<Node234*> kids;
    bool leaf;
    explicit Node234(bool is_leaf) : leaf(is_leaf) {}
};

struct TwoThreeFourTree {
    static const int MAX_KEYS = 3;
    Node234* root = nullptr;

    void split_child(Node234* parent, int i) {
        Node234* full = parent->kids[i];
        Node234* right = new Node234(full->leaf);
        int mid = full->keys[1];
        right->keys.assign(full->keys.begin() + 2, full->keys.end());
        full->keys.resize(1);
        if (!full->leaf) {
            right->kids.assign(full->kids.begin() + 2, full->kids.end());
            full->kids.resize(2);
        }
        parent->keys.insert(parent->keys.begin() + i, mid);
        parent->kids.insert(parent->kids.begin() + i + 1, right);
    }

    void insert_non_full(Node234* node, int key) {
        if (node->leaf) {
            node->keys.push_back(key);
            sort(node->keys.begin(), node->keys.end());
            return;
        }
        int i = 0;
        while (i < (int)node->keys.size() && key > node->keys[i]) i++;
        if ((int)node->kids[i]->keys.size() == MAX_KEYS) {
            split_child(node, i);
            if (key > node->keys[i]) i++;
        }
        insert_non_full(node->kids[i], key);
    }

    void insert(int key) {
        if (!root) {
            root = new Node234(true);
            root->keys.push_back(key);
            return;
        }
        if ((int)root->keys.size() == MAX_KEYS) {
            Node234* fresh = new Node234(false);
            fresh->kids.push_back(root);
            split_child(fresh, 0);
            root = fresh;
        }
        insert_non_full(root, key);
    }
};`,
    `MAX_KEYS = 3  # 2-3-4 tree: up to 3 keys, 4 children


class Node234:
    def __init__(self, leaf=True):
        self.keys = []
        self.kids = []
        self.leaf = leaf


class TwoThreeFourTree:
    def __init__(self, values=None):
        self.root = None
        for v in values or []:
            self.insert(v)

    def split_child(self, parent, i):
        full = parent.kids[i]
        mid = full.keys[1]
        right = Node234(full.leaf)
        right.keys = full.keys[2:]
        full.keys = full.keys[:1]
        if not full.leaf:
            right.kids = full.kids[2:]
            full.kids = full.kids[:2]
        parent.keys.insert(i, mid)
        parent.kids.insert(i + 1, right)

    def insert_non_full(self, node, key):
        if node.leaf:
            node.keys.append(key)
            node.keys.sort()
            return
        i = 0
        while i < len(node.keys) and key > node.keys[i]:
            i += 1
        if len(node.kids[i].keys) == MAX_KEYS:
            self.split_child(node, i)
            if key > node.keys[i]:
                i += 1
        self.insert_non_full(node.kids[i], key)

    def insert(self, key):
        if self.root is None:
            self.root = Node234()
            self.root.keys.append(key)
            return self
        if len(self.root.keys) == MAX_KEYS:
            fresh = Node234(leaf=False)
            fresh.kids.append(self.root)
            self.split_child(fresh, 0)
            self.root = fresh
        self.insert_non_full(self.root, key)
        return self

    def search(self, key):
        node = self.root
        while node:
            if key in node.keys:
                return node
            if node.leaf:
                return None
            i = 0
            while i < len(node.keys) and key > node.keys[i]:
                i += 1
            node = node.kids[i]
        return None`,
    `class Node234 {
    List<Integer> keys = new ArrayList<>();
    List<Node234> kids = new ArrayList<>();
    boolean leaf;
    Node234(boolean leaf) { this.leaf = leaf; }
}

class TwoThreeFourTree {
    static final int MAX_KEYS = 3;
    Node234 root;

    private void splitChild(Node234 parent, int i) {
        Node234 full = parent.kids.get(i);
        int mid = full.keys.get(1);
        Node234 right = new Node234(full.leaf);
        right.keys = new ArrayList<>(full.keys.subList(2, full.keys.size()));
        full.keys = new ArrayList<>(full.keys.subList(0, 1));
        if (!full.leaf) {
            right.kids = new ArrayList<>(full.kids.subList(2, full.kids.size()));
            full.kids = new ArrayList<>(full.kids.subList(0, 2));
        }
        parent.keys.add(i, mid);
        parent.kids.add(i + 1, right);
    }

    private void insertNonFull(Node234 node, int key) {
        if (node.leaf) {
            node.keys.add(key);
            Collections.sort(node.keys);
            return;
        }
        int i = 0;
        while (i < node.keys.size() && key > node.keys.get(i)) i++;
        if (node.kids.get(i).keys.size() == MAX_KEYS) {
            splitChild(node, i);
            if (key > node.keys.get(i)) i++;
        }
        insertNonFull(node.kids.get(i), key);
    }

    void insert(int key) {
        if (root == null) {
            root = new Node234(true);
            root.keys.add(key);
            return;
        }
        if (root.keys.size() == MAX_KEYS) {
            Node234 fresh = new Node234(false);
            fresh.kids.add(root);
            splitChild(fresh, 0);
            root = fresh;
        }
        insertNonFull(root, key);
    }
}`,
    `const MAX_KEYS = 3; // 2-3-4 tree: up to 3 keys, 4 children

class Node234 {
  constructor(leaf = true) {
    this.keys = [];
    this.kids = [];
    this.leaf = leaf;
  }
}

class TwoThreeFourTree {
  constructor(values = []) {
    this.root = null;
    for (const v of values) this.insert(v);
  }

  splitChild(parent, i) {
    const full = parent.kids[i];
    const mid = full.keys[1];
    const right = new Node234(full.leaf);
    right.keys = full.keys.slice(2);
    full.keys = full.keys.slice(0, 1);
    if (!full.leaf) {
      right.kids = full.kids.slice(2);
      full.kids = full.kids.slice(0, 2);
    }
    parent.keys.splice(i, 0, mid);
    parent.kids.splice(i + 1, 0, right);
  }

  insertNonFull(node, key) {
    if (node.leaf) {
      node.keys.push(key);
      node.keys.sort((a, b) => a - b);
      return;
    }
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;
    if (node.kids[i].keys.length === MAX_KEYS) {
      this.splitChild(node, i);
      if (key > node.keys[i]) i++;
    }
    this.insertNonFull(node.kids[i], key);
  }

  insert(key) {
    if (!this.root) {
      this.root = new Node234();
      this.root.keys.push(key);
      return this;
    }
    if (this.root.keys.length === MAX_KEYS) {
      const fresh = new Node234(false);
      fresh.kids.push(this.root);
      this.splitChild(fresh, 0);
      this.root = fresh;
    }
    this.insertNonFull(this.root, key);
    return this;
  }
}`,
    `class Node234 {
    public List<int> Keys { get; set; } = new();
    public List<Node234> Kids { get; set; } = new();
    public bool Leaf { get; }
    public Node234(bool leaf) { Leaf = leaf; }
}

class TwoThreeFourTree {
    const int MaxKeys = 3;
    public Node234? Root { get; private set; }

    void SplitChild(Node234 parent, int i) {
        Node234 full = parent.Kids[i];
        int mid = full.Keys[1];
        var right = new Node234(full.Leaf) {
            Keys = full.Keys.GetRange(2, full.Keys.Count - 2),
        };
        full.Keys = full.Keys.GetRange(0, 1);
        if (!full.Leaf) {
            right.Kids = full.Kids.GetRange(2, full.Kids.Count - 2);
            full.Kids = full.Kids.GetRange(0, 2);
        }
        parent.Keys.Insert(i, mid);
        parent.Kids.Insert(i + 1, right);
    }

    void InsertNonFull(Node234 node, int key) {
        if (node.Leaf) {
            node.Keys.Add(key);
            node.Keys.Sort();
            return;
        }
        int i = 0;
        while (i < node.Keys.Count && key > node.Keys[i]) i++;
        if (node.Kids[i].Keys.Count == MaxKeys) {
            SplitChild(node, i);
            if (key > node.Keys[i]) i++;
        }
        InsertNonFull(node.Kids[i], key);
    }

    public void Insert(int key) {
        if (Root == null) {
            Root = new Node234(true);
            Root.Keys.Add(key);
            return;
        }
        if (Root.Keys.Count == MaxKeys) {
            var fresh = new Node234(false);
            fresh.Kids.Add(Root);
            SplitChild(fresh, 0);
            Root = fresh;
        }
        InsertNonFull(Root, key);
    }
}`,
  ),

  btree: snippets(
    `#define BT_T 3                    /* minimum degree */
#define BT_MAX (2 * BT_T - 1)      /* max keys per node */

typedef struct BTNode {
    int keys[BT_MAX];
    int n;
    struct BTNode* kids[BT_MAX + 1];
    int leaf;
} BTNode;

BTNode* bt_new(int leaf) {
    BTNode* node = (BTNode*)calloc(1, sizeof(BTNode));
    node->leaf = leaf;
    return node;
}

BTNode* bt_search(BTNode* node, int key) {
    while (node) {
        int i = 0;
        while (i < node->n && key > node->keys[i]) i++;
        if (i < node->n && node->keys[i] == key) return node;
        if (node->leaf) return NULL;
        node = node->kids[i];
    }
    return NULL;
}

void bt_split_child(BTNode* parent, int i) {
    BTNode* full = parent->kids[i];
    BTNode* right = bt_new(full->leaf);
    int mid = full->keys[BT_T - 1];
    right->n = BT_T - 1;
    for (int j = 0; j < BT_T - 1; j++) right->keys[j] = full->keys[j + BT_T];
    if (!full->leaf)
        for (int j = 0; j < BT_T; j++) right->kids[j] = full->kids[j + BT_T];
    full->n = BT_T - 1;
    for (int j = parent->n; j > i; j--) {
        parent->keys[j] = parent->keys[j - 1];
        parent->kids[j + 1] = parent->kids[j];
    }
    parent->keys[i] = mid;
    parent->kids[i + 1] = right;
    parent->n++;
}

void bt_insert_non_full(BTNode* node, int key) {
    if (node->leaf) {
        int j = node->n - 1;
        while (j >= 0 && node->keys[j] > key) { node->keys[j + 1] = node->keys[j]; j--; }
        node->keys[j + 1] = key;
        node->n++;
        return;
    }
    int i = 0;
    while (i < node->n && key > node->keys[i]) i++;
    if (node->kids[i]->n == BT_MAX) {
        bt_split_child(node, i);
        if (key > node->keys[i]) i++;
    }
    bt_insert_non_full(node->kids[i], key);
}

BTNode* bt_insert(BTNode* root, int key) {
    if (!root) {
        root = bt_new(1);
        root->keys[0] = key;
        root->n = 1;
        return root;
    }
    if (root->n == BT_MAX) {
        BTNode* fresh = bt_new(0);
        fresh->kids[0] = root;
        bt_split_child(fresh, 0);
        root = fresh;
    }
    bt_insert_non_full(root, key);
    return root;
}`,
    `struct BTNode {
    vector<int> keys;
    vector<BTNode*> kids;
    bool leaf;
    explicit BTNode(bool is_leaf) : leaf(is_leaf) {}
};

struct BTree {
    int t;                 // minimum degree
    BTNode* root = nullptr;

    explicit BTree(int degree) : t(degree) {}

    int max_keys() const { return 2 * t - 1; }

    BTNode* search(int key) const {
        BTNode* node = root;
        while (node) {
            int i = 0;
            while (i < (int)node->keys.size() && key > node->keys[i]) i++;
            if (i < (int)node->keys.size() && node->keys[i] == key) return node;
            if (node->leaf) return nullptr;
            node = node->kids[i];
        }
        return nullptr;
    }

    void split_child(BTNode* parent, int i) {
        BTNode* full = parent->kids[i];
        BTNode* right = new BTNode(full->leaf);
        int mid = full->keys[t - 1];
        right->keys.assign(full->keys.begin() + t, full->keys.end());
        if (!full->leaf) right->kids.assign(full->kids.begin() + t, full->kids.end());
        full->keys.resize(t - 1);
        if (!full->leaf) full->kids.resize(t);
        parent->keys.insert(parent->keys.begin() + i, mid);
        parent->kids.insert(parent->kids.begin() + i + 1, right);
    }

    void insert_non_full(BTNode* node, int key) {
        if (node->leaf) {
            node->keys.insert(upper_bound(node->keys.begin(), node->keys.end(), key), key);
            return;
        }
        int i = 0;
        while (i < (int)node->keys.size() && key > node->keys[i]) i++;
        if ((int)node->kids[i]->keys.size() == max_keys()) {
            split_child(node, i);
            if (key > node->keys[i]) i++;
        }
        insert_non_full(node->kids[i], key);
    }

    void insert(int key) {
        if (!root) {
            root = new BTNode(true);
            root->keys.push_back(key);
            return;
        }
        if ((int)root->keys.size() == max_keys()) {
            BTNode* fresh = new BTNode(false);
            fresh->kids.push_back(root);
            split_child(fresh, 0);
            root = fresh;
        }
        insert_non_full(root, key);
    }
};`,
    `import bisect


class BTNode:
    def __init__(self, leaf=True):
        self.keys = []
        self.kids = []
        self.leaf = leaf


class BTree:
    def __init__(self, t=3, values=None):
        self.t = t
        self.root = None
        for v in values or []:
            self.insert(v)

    @property
    def max_keys(self):
        return 2 * self.t - 1

    def search(self, key):
        node = self.root
        while node:
            i = bisect.bisect_left(node.keys, key)
            if i < len(node.keys) and node.keys[i] == key:
                return node
            if node.leaf:
                return None
            node = node.kids[i]
        return None

    def split_child(self, parent, i):
        t, full = self.t, parent.kids[i]
        mid = full.keys[t - 1]
        right = BTNode(full.leaf)
        right.keys = full.keys[t:]
        full.keys = full.keys[: t - 1]
        if not full.leaf:
            right.kids = full.kids[t:]
            full.kids = full.kids[:t]
        parent.keys.insert(i, mid)
        parent.kids.insert(i + 1, right)

    def insert_non_full(self, node, key):
        if node.leaf:
            bisect.insort(node.keys, key)
            return
        i = 0
        while i < len(node.keys) and key > node.keys[i]:
            i += 1
        if len(node.kids[i].keys) == self.max_keys:
            self.split_child(node, i)
            if key > node.keys[i]:
                i += 1
        self.insert_non_full(node.kids[i], key)

    def insert(self, key):
        if self.root is None:
            self.root = BTNode()
            self.root.keys.append(key)
            return self
        if len(self.root.keys) == self.max_keys:
            fresh = BTNode(leaf=False)
            fresh.kids.append(self.root)
            self.split_child(fresh, 0)
            self.root = fresh
        self.insert_non_full(self.root, key)
        return self`,
    `class BTNode {
    List<Integer> keys = new ArrayList<>();
    List<BTNode> kids = new ArrayList<>();
    boolean leaf;
    BTNode(boolean leaf) { this.leaf = leaf; }
}

class BTree {
    final int t;
    BTNode root;

    BTree(int minDegree) { t = minDegree; }

    int maxKeys() { return 2 * t - 1; }

    BTNode search(int key) {
        BTNode node = root;
        while (node != null) {
            int i = 0;
            while (i < node.keys.size() && key > node.keys.get(i)) i++;
            if (i < node.keys.size() && node.keys.get(i) == key) return node;
            if (node.leaf) return null;
            node = node.kids.get(i);
        }
        return null;
    }

    private void splitChild(BTNode parent, int i) {
        BTNode full = parent.kids.get(i);
        int mid = full.keys.get(t - 1);
        BTNode right = new BTNode(full.leaf);
        right.keys = new ArrayList<>(full.keys.subList(t, full.keys.size()));
        if (!full.leaf) {
            right.kids = new ArrayList<>(full.kids.subList(t, full.kids.size()));
            full.kids = new ArrayList<>(full.kids.subList(0, t));
        }
        full.keys = new ArrayList<>(full.keys.subList(0, t - 1));
        parent.keys.add(i, mid);
        parent.kids.add(i + 1, right);
    }

    private void insertNonFull(BTNode node, int key) {
        if (node.leaf) {
            int j = 0;
            while (j < node.keys.size() && node.keys.get(j) < key) j++;
            node.keys.add(j, key);
            return;
        }
        int i = 0;
        while (i < node.keys.size() && key > node.keys.get(i)) i++;
        if (node.kids.get(i).keys.size() == maxKeys()) {
            splitChild(node, i);
            if (key > node.keys.get(i)) i++;
        }
        insertNonFull(node.kids.get(i), key);
    }

    void insert(int key) {
        if (root == null) {
            root = new BTNode(true);
            root.keys.add(key);
            return;
        }
        if (root.keys.size() == maxKeys()) {
            BTNode fresh = new BTNode(false);
            fresh.kids.add(root);
            splitChild(fresh, 0);
            root = fresh;
        }
        insertNonFull(root, key);
    }
}`,
    `class BTNode {
  constructor(leaf = true) {
    this.keys = [];
    this.kids = [];
    this.leaf = leaf;
  }
}

class BTree {
  constructor(t = 3, values = []) {
    this.t = t;
    this.root = null;
    for (const v of values) this.insert(v);
  }

  get maxKeys() {
    return 2 * this.t - 1;
  }

  search(key) {
    let node = this.root;
    while (node) {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i++;
      if (i < node.keys.length && node.keys[i] === key) return node;
      if (node.leaf) return null;
      node = node.kids[i];
    }
    return null;
  }

  splitChild(parent, i) {
    const t = this.t;
    const full = parent.kids[i];
    const mid = full.keys[t - 1];
    const right = new BTNode(full.leaf);
    right.keys = full.keys.slice(t);
    full.keys = full.keys.slice(0, t - 1);
    if (!full.leaf) {
      right.kids = full.kids.slice(t);
      full.kids = full.kids.slice(0, t);
    }
    parent.keys.splice(i, 0, mid);
    parent.kids.splice(i + 1, 0, right);
  }

  insertNonFull(node, key) {
    if (node.leaf) {
      let j = 0;
      while (j < node.keys.length && node.keys[j] < key) j++;
      node.keys.splice(j, 0, key);
      return;
    }
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;
    if (node.kids[i].keys.length === this.maxKeys) {
      this.splitChild(node, i);
      if (key > node.keys[i]) i++;
    }
    this.insertNonFull(node.kids[i], key);
  }

  insert(key) {
    if (!this.root) {
      this.root = new BTNode();
      this.root.keys.push(key);
      return this;
    }
    if (this.root.keys.length === this.maxKeys) {
      const fresh = new BTNode(false);
      fresh.kids.push(this.root);
      this.splitChild(fresh, 0);
      this.root = fresh;
    }
    this.insertNonFull(this.root, key);
    return this;
  }
}`,
    `class BTNode {
    public List<int> Keys { get; set; } = new();
    public List<BTNode> Kids { get; set; } = new();
    public bool Leaf { get; }
    public BTNode(bool leaf) { Leaf = leaf; }
}

class BTree {
    readonly int t;
    public BTNode? Root { get; private set; }

    public BTree(int minDegree) { t = minDegree; }

    int MaxKeys => 2 * t - 1;

    public BTNode? Search(int key) {
        BTNode? node = Root;
        while (node != null) {
            int i = 0;
            while (i < node.Keys.Count && key > node.Keys[i]) i++;
            if (i < node.Keys.Count && node.Keys[i] == key) return node;
            if (node.Leaf) return null;
            node = node.Kids[i];
        }
        return null;
    }

    void SplitChild(BTNode parent, int i) {
        BTNode full = parent.Kids[i];
        int mid = full.Keys[t - 1];
        var right = new BTNode(full.Leaf) {
            Keys = full.Keys.GetRange(t, full.Keys.Count - t),
        };
        if (!full.Leaf) {
            right.Kids = full.Kids.GetRange(t, full.Kids.Count - t);
            full.Kids = full.Kids.GetRange(0, t);
        }
        full.Keys = full.Keys.GetRange(0, t - 1);
        parent.Keys.Insert(i, mid);
        parent.Kids.Insert(i + 1, right);
    }

    void InsertNonFull(BTNode node, int key) {
        if (node.Leaf) {
            int j = 0;
            while (j < node.Keys.Count && node.Keys[j] < key) j++;
            node.Keys.Insert(j, key);
            return;
        }
        int i = 0;
        while (i < node.Keys.Count && key > node.Keys[i]) i++;
        if (node.Kids[i].Keys.Count == MaxKeys) {
            SplitChild(node, i);
            if (key > node.Keys[i]) i++;
        }
        InsertNonFull(node.Kids[i], key);
    }

    public void Insert(int key) {
        if (Root == null) {
            Root = new BTNode(true);
            Root.Keys.Add(key);
            return;
        }
        if (Root.Keys.Count == MaxKeys) {
            var fresh = new BTNode(false);
            fresh.Kids.Add(Root);
            SplitChild(fresh, 0);
            Root = fresh;
        }
        InsertNonFull(Root, key);
    }
}`,
  ),

  bplus: snippets(
    `#define BP_MAX 3   /* max keys per node */

typedef struct BPNode {
    int keys[BP_MAX + 1];
    int n;
    struct BPNode* kids[BP_MAX + 2];
    struct BPNode* next;
    int leaf;
} BPNode;

BPNode* bp_new(int leaf) {
    BPNode* node = (BPNode*)calloc(1, sizeof(BPNode));
    node->leaf = leaf;
    return node;
}

/* returns 1 on split: separator in *up, new sibling in *right */
int bp_insert(BPNode* node, int key, int* up, BPNode** right) {
    if (node->leaf) {
        int j = node->n - 1;
        while (j >= 0 && node->keys[j] > key) { node->keys[j + 1] = node->keys[j]; j--; }
        node->keys[j + 1] = key;
        node->n++;
        if (node->n <= BP_MAX) return 0;
        int mid = node->n / 2;
        BPNode* sib = bp_new(1);
        sib->n = node->n - mid;
        for (int t = 0; t < sib->n; t++) sib->keys[t] = node->keys[mid + t];
        node->n = mid;
        sib->next = node->next;
        node->next = sib;
        *up = sib->keys[0];          /* separator is copied up */
        *right = sib;
        return 1;
    }
    int i = 0;
    while (i < node->n && key >= node->keys[i]) i++;
    int ck = 0;
    BPNode* cr = NULL;
    if (!bp_insert(node->kids[i], key, &ck, &cr)) return 0;
    for (int j = node->n; j > i; j--) {
        node->keys[j] = node->keys[j - 1];
        node->kids[j + 1] = node->kids[j];
    }
    node->keys[i] = ck;
    node->kids[i + 1] = cr;
    node->n++;
    if (node->n <= BP_MAX) return 0;
    int mid = node->n / 2;
    *up = node->keys[mid];           /* separator moves up */
    BPNode* sib = bp_new(0);
    sib->n = node->n - mid - 1;
    for (int t = 0; t < sib->n; t++) sib->keys[t] = node->keys[mid + 1 + t];
    for (int t = 0; t <= sib->n; t++) sib->kids[t] = node->kids[mid + 1 + t];
    node->n = mid;
    *right = sib;
    return 1;
}

BPNode* bp_root_insert(BPNode* root, int key) {
    if (!root) {
        root = bp_new(1);
        root->keys[0] = key;
        root->n = 1;
        return root;
    }
    int up = 0;
    BPNode* right = NULL;
    if (bp_insert(root, key, &up, &right)) {
        BPNode* fresh = bp_new(0);
        fresh->keys[0] = up;
        fresh->n = 1;
        fresh->kids[0] = root;
        fresh->kids[1] = right;
        return fresh;
    }
    return root;
}

int bp_range(BPNode* root, int lo, int hi, int* out) {
    BPNode* node = root;
    while (node && !node->leaf) {
        int i = 0;
        while (i < node->n && lo >= node->keys[i]) i++;
        node = node->kids[i];
    }
    int k = 0;
    while (node) {
        for (int j = 0; j < node->n; j++) {
            if (node->keys[j] > hi) return k;
            if (node->keys[j] >= lo) out[k++] = node->keys[j];
        }
        node = node->next;
    }
    return k;
}`,
    `struct BPNode {
    vector<int> keys;
    vector<BPNode*> kids;
    BPNode* next = nullptr;
    bool leaf;
    explicit BPNode(bool is_leaf) : leaf(is_leaf) {}
};

struct BPlusTree {
    static const int MAX_KEYS = 3;
    BPNode* root = nullptr;

    struct Split { bool happened = false; int up = 0; BPNode* right = nullptr; };

    void insert(int key) {
        if (!root) {
            root = new BPNode(true);
            root->keys.push_back(key);
            return;
        }
        Split s = insert_into(root, key);
        if (s.happened) {
            BPNode* fresh = new BPNode(false);
            fresh->keys.push_back(s.up);
            fresh->kids = {root, s.right};
            root = fresh;
        }
    }

    Split insert_into(BPNode* node, int key) {
        Split out;
        if (node->leaf) {
            node->keys.insert(upper_bound(node->keys.begin(), node->keys.end(), key), key);
            if ((int)node->keys.size() <= MAX_KEYS) return out;
            int mid = (int)node->keys.size() / 2;
            BPNode* sib = new BPNode(true);
            sib->keys.assign(node->keys.begin() + mid, node->keys.end());
            node->keys.resize(mid);
            sib->next = node->next;
            node->next = sib;
            out.happened = true;
            out.up = sib->keys.front();   // copy up
            out.right = sib;
            return out;
        }
        int i = 0;
        while (i < (int)node->keys.size() && key >= node->keys[i]) i++;
        Split child = insert_into(node->kids[i], key);
        if (!child.happened) return out;
        node->keys.insert(node->keys.begin() + i, child.up);
        node->kids.insert(node->kids.begin() + i + 1, child.right);
        if ((int)node->keys.size() <= MAX_KEYS) return out;
        int mid = (int)node->keys.size() / 2;
        BPNode* sib = new BPNode(false);
        out.up = node->keys[mid];         // move up
        sib->keys.assign(node->keys.begin() + mid + 1, node->keys.end());
        sib->kids.assign(node->kids.begin() + mid + 1, node->kids.end());
        node->keys.resize(mid);
        node->kids.resize(mid + 1);
        out.happened = true;
        out.right = sib;
        return out;
    }

    vector<int> range(int lo, int hi) const {
        BPNode* node = root;
        while (node && !node->leaf) {
            int i = 0;
            while (i < (int)node->keys.size() && lo >= node->keys[i]) i++;
            node = node->kids[i];
        }
        vector<int> out;
        for (; node; node = node->next)
            for (int k : node->keys) {
                if (k > hi) return out;
                if (k >= lo) out.push_back(k);
            }
        return out;
    }
};`,
    `import bisect

MAX_KEYS = 3


class BPNode:
    def __init__(self, leaf=True):
        self.keys = []
        self.kids = []
        self.next = None
        self.leaf = leaf


class BPlusTree:
    def __init__(self, values=None):
        self.root = BPNode()
        for v in values or []:
            self.insert(v)

    def insert(self, key):
        split = self._insert(self.root, key)
        if split:
            up, right = split
            fresh = BPNode(leaf=False)
            fresh.keys = [up]
            fresh.kids = [self.root, right]
            self.root = fresh
        return self

    def _insert(self, node, key):
        """Returns (separator, new_sibling) when the node overflows."""
        if node.leaf:
            bisect.insort(node.keys, key)
            if len(node.keys) <= MAX_KEYS:
                return None
            mid = len(node.keys) // 2
            sibling = BPNode()
            sibling.keys = node.keys[mid:]
            node.keys = node.keys[:mid]
            sibling.next = node.next
            node.next = sibling
            return sibling.keys[0], sibling  # copy up
        i = 0
        while i < len(node.keys) and key >= node.keys[i]:
            i += 1
        split = self._insert(node.kids[i], key)
        if split is None:
            return None
        up, right = split
        node.keys.insert(i, up)
        node.kids.insert(i + 1, right)
        if len(node.keys) <= MAX_KEYS:
            return None
        mid = len(node.keys) // 2
        promoted = node.keys[mid]  # move up
        sibling = BPNode(leaf=False)
        sibling.keys = node.keys[mid + 1 :]
        sibling.kids = node.kids[mid + 1 :]
        node.keys = node.keys[:mid]
        node.kids = node.kids[: mid + 1]
        return promoted, sibling

    def leaf_for(self, key):
        node = self.root
        while not node.leaf:
            i = 0
            while i < len(node.keys) and key >= node.keys[i]:
                i += 1
            node = node.kids[i]
        return node

    def range(self, lo, hi):
        out, node = [], self.leaf_for(lo)
        while node:
            for k in node.keys:
                if k > hi:
                    return out
                if k >= lo:
                    out.append(k)
            node = node.next
        return out`,
    `class BPNode {
    List<Integer> keys = new ArrayList<>();
    List<BPNode> kids = new ArrayList<>();
    BPNode next;
    boolean leaf;
    BPNode(boolean leaf) { this.leaf = leaf; }
}

class BPlusTree {
    static final int MAX_KEYS = 3;
    BPNode root = new BPNode(true);

    static class Split {
        final int up; final BPNode right;
        Split(int up, BPNode right) { this.up = up; this.right = right; }
    }

    void insert(int key) {
        Split split = insert(root, key);
        if (split != null) {
            BPNode fresh = new BPNode(false);
            fresh.keys.add(split.up);
            fresh.kids.add(root);
            fresh.kids.add(split.right);
            root = fresh;
        }
    }

    private Split insert(BPNode node, int key) {
        if (node.leaf) {
            int j = 0;
            while (j < node.keys.size() && node.keys.get(j) < key) j++;
            node.keys.add(j, key);
            if (node.keys.size() <= MAX_KEYS) return null;
            int mid = node.keys.size() / 2;
            BPNode sib = new BPNode(true);
            sib.keys = new ArrayList<>(node.keys.subList(mid, node.keys.size()));
            node.keys = new ArrayList<>(node.keys.subList(0, mid));
            sib.next = node.next;
            node.next = sib;
            return new Split(sib.keys.get(0), sib);   // copy up
        }
        int i = 0;
        while (i < node.keys.size() && key >= node.keys.get(i)) i++;
        Split child = insert(node.kids.get(i), key);
        if (child == null) return null;
        node.keys.add(i, child.up);
        node.kids.add(i + 1, child.right);
        if (node.keys.size() <= MAX_KEYS) return null;
        int mid = node.keys.size() / 2;
        int promoted = node.keys.get(mid);           // move up
        BPNode sib = new BPNode(false);
        sib.keys = new ArrayList<>(node.keys.subList(mid + 1, node.keys.size()));
        sib.kids = new ArrayList<>(node.kids.subList(mid + 1, node.kids.size()));
        node.keys = new ArrayList<>(node.keys.subList(0, mid));
        node.kids = new ArrayList<>(node.kids.subList(0, mid + 1));
        return new Split(promoted, sib);
    }

    List<Integer> range(int lo, int hi) {
        BPNode node = root;
        while (!node.leaf) {
            int i = 0;
            while (i < node.keys.size() && lo >= node.keys.get(i)) i++;
            node = node.kids.get(i);
        }
        List<Integer> out = new ArrayList<>();
        for (; node != null; node = node.next)
            for (int k : node.keys) {
                if (k > hi) return out;
                if (k >= lo) out.add(k);
            }
        return out;
    }
}`,
    `const MAX_KEYS = 3;

class BPNode {
  constructor(leaf = true) {
    this.keys = [];
    this.kids = [];
    this.next = null;
    this.leaf = leaf;
  }
}

class BPlusTree {
  constructor(values = []) {
    this.root = new BPNode();
    for (const v of values) this.insert(v);
  }

  insert(key) {
    const split = this.insertInto(this.root, key);
    if (split) {
      const fresh = new BPNode(false);
      fresh.keys = [split.up];
      fresh.kids = [this.root, split.right];
      this.root = fresh;
    }
    return this;
  }

  insertInto(node, key) {
    if (node.leaf) {
      let j = 0;
      while (j < node.keys.length && node.keys[j] < key) j++;
      node.keys.splice(j, 0, key);
      if (node.keys.length <= MAX_KEYS) return null;
      const mid = node.keys.length >> 1;
      const sib = new BPNode(true);
      sib.keys = node.keys.slice(mid);
      node.keys = node.keys.slice(0, mid);
      sib.next = node.next;
      node.next = sib;
      return { up: sib.keys[0], right: sib }; // copy up
    }
    let i = 0;
    while (i < node.keys.length && key >= node.keys[i]) i++;
    const child = this.insertInto(node.kids[i], key);
    if (!child) return null;
    node.keys.splice(i, 0, child.up);
    node.kids.splice(i + 1, 0, child.right);
    if (node.keys.length <= MAX_KEYS) return null;
    const mid = node.keys.length >> 1;
    const promoted = node.keys[mid]; // move up
    const sib = new BPNode(false);
    sib.keys = node.keys.slice(mid + 1);
    sib.kids = node.kids.slice(mid + 1);
    node.keys = node.keys.slice(0, mid);
    node.kids = node.kids.slice(0, mid + 1);
    return { up: promoted, right: sib };
  }

  leafFor(key) {
    let node = this.root;
    while (!node.leaf) {
      let i = 0;
      while (i < node.keys.length && key >= node.keys[i]) i++;
      node = node.kids[i];
    }
    return node;
  }

  range(lo, hi) {
    const out = [];
    let node = this.leafFor(lo);
    while (node) {
      for (const k of node.keys) {
        if (k > hi) return out;
        if (k >= lo) out.push(k);
      }
      node = node.next;
    }
    return out;
  }
}`,
    `class BPNode {
    public List<int> Keys { get; set; } = new();
    public List<BPNode> Kids { get; set; } = new();
    public BPNode? Next { get; set; }
    public bool Leaf { get; }
    public BPNode(bool leaf) { Leaf = leaf; }
}

class BPlusTree {
    const int MaxKeys = 3;
    public BPNode Root { get; private set; } = new BPNode(true);

    public void Insert(int key) {
        var split = InsertInto(Root, key);
        if (split != null) {
            var fresh = new BPNode(false) { Keys = new List<int> { split.Value.Up } };
            fresh.Kids = new List<BPNode> { Root, split.Value.Right };
            Root = fresh;
        }
    }

    (int Up, BPNode Right)? InsertInto(BPNode node, int key) {
        if (node.Leaf) {
            int j = 0;
            while (j < node.Keys.Count && node.Keys[j] < key) j++;
            node.Keys.Insert(j, key);
            if (node.Keys.Count <= MaxKeys) return null;
            int mid = node.Keys.Count / 2;
            var sib = new BPNode(true) {
                Keys = node.Keys.GetRange(mid, node.Keys.Count - mid),
                Next = node.Next,
            };
            node.Keys = node.Keys.GetRange(0, mid);
            node.Next = sib;
            return (sib.Keys[0], sib);   // copy up
        }
        int i = 0;
        while (i < node.Keys.Count && key >= node.Keys[i]) i++;
        var child = InsertInto(node.Kids[i], key);
        if (child == null) return null;
        node.Keys.Insert(i, child.Value.Up);
        node.Kids.Insert(i + 1, child.Value.Right);
        if (node.Keys.Count <= MaxKeys) return null;
        int m = node.Keys.Count / 2;
        int promoted = node.Keys[m];     // move up
        var right = new BPNode(false) {
            Keys = node.Keys.GetRange(m + 1, node.Keys.Count - m - 1),
            Kids = node.Kids.GetRange(m + 1, node.Kids.Count - m - 1),
        };
        node.Keys = node.Keys.GetRange(0, m);
        node.Kids = node.Kids.GetRange(0, m + 1);
        return (promoted, right);
    }

    public List<int> Range(int lo, int hi) {
        BPNode node = Root;
        while (!node.Leaf) {
            int i = 0;
            while (i < node.Keys.Count && lo >= node.Keys[i]) i++;
            node = node.Kids[i];
        }
        var acc = new List<int>();
        for (BPNode? cur = node; cur != null; cur = cur.Next)
            foreach (int k in cur.Keys) {
                if (k > hi) return acc;
                if (k >= lo) acc.Add(k);
            }
        return acc;
    }
}`,
  ),

  "binomial-heap": snippets(
    `typedef struct BNode {
    int key, degree;
    struct BNode *parent, *child, *sibling;
} BNode;

BNode* bnode_new(int key) {
    BNode* n = (BNode*)calloc(1, sizeof(BNode));
    n->key = key;
    return n;
}

/* y becomes a child of z (both have equal degree) */
void bh_link(BNode* y, BNode* z) {
    y->parent = z;
    y->sibling = z->child;
    z->child = y;
    z->degree++;
}

/* merge two root lists keeping degrees non-decreasing */
BNode* bh_merge(BNode* a, BNode* b) {
    BNode head;
    head.sibling = NULL;
    BNode* tail = &head;
    while (a && b) {
        if (a->degree <= b->degree) { tail->sibling = a; a = a->sibling; }
        else { tail->sibling = b; b = b->sibling; }
        tail = tail->sibling;
    }
    tail->sibling = a ? a : b;
    return head.sibling;
}

BNode* bh_union(BNode* h1, BNode* h2) {
    BNode* h = bh_merge(h1, h2);
    if (!h) return NULL;
    BNode *prev = NULL, *cur = h, *next = cur->sibling;
    while (next) {
        if (cur->degree != next->degree ||
            (next->sibling && next->sibling->degree == cur->degree)) {
            prev = cur;
            cur = next;
        } else if (cur->key <= next->key) {
            cur->sibling = next->sibling;
            bh_link(next, cur);
        } else {
            if (prev) prev->sibling = next; else h = next;
            bh_link(cur, next);
            cur = next;
        }
        next = cur->sibling;
    }
    return h;
}

BNode* bh_insert(BNode* h, int key) { return bh_union(h, bnode_new(key)); }

BNode* bh_minimum(BNode* h) {
    BNode* best = h;
    for (BNode* n = h; n; n = n->sibling) if (n->key < best->key) best = n;
    return best;
}

BNode* bh_extract_min(BNode* h, int* out) {
    if (!h) return NULL;
    BNode *target = h, *target_prev = NULL, *prev = NULL;
    for (BNode* n = h; n; prev = n, n = n->sibling)
        if (n->key < target->key) { target = n; target_prev = prev; }
    *out = target->key;
    if (target_prev) target_prev->sibling = target->sibling;
    else h = target->sibling;
    BNode *kid = target->child, *reversed = NULL;
    while (kid) {
        BNode* next = kid->sibling;
        kid->sibling = reversed;
        kid->parent = NULL;
        reversed = kid;
        kid = next;
    }
    free(target);
    return bh_union(h, reversed);
}`,
    `struct BNode {
    int key, degree = 0;
    BNode *parent = nullptr, *child = nullptr, *sibling = nullptr;
    explicit BNode(int k) : key(k) {}
};

struct BinomialHeap {
    BNode* head = nullptr;

    static void link(BNode* y, BNode* z) {   // y becomes a child of z
        y->parent = z;
        y->sibling = z->child;
        z->child = y;
        z->degree++;
    }

    static BNode* merge(BNode* a, BNode* b) {
        BNode dummy(0);
        BNode* tail = &dummy;
        while (a && b) {
            if (a->degree <= b->degree) { tail->sibling = a; a = a->sibling; }
            else { tail->sibling = b; b = b->sibling; }
            tail = tail->sibling;
        }
        tail->sibling = a ? a : b;
        return dummy.sibling;
    }

    static BNode* unite(BNode* h1, BNode* h2) {
        BNode* h = merge(h1, h2);
        if (!h) return nullptr;
        BNode *prev = nullptr, *cur = h, *next = cur->sibling;
        while (next) {
            if (cur->degree != next->degree ||
                (next->sibling && next->sibling->degree == cur->degree)) {
                prev = cur;
                cur = next;
            } else if (cur->key <= next->key) {
                cur->sibling = next->sibling;
                link(next, cur);
            } else {
                if (prev) prev->sibling = next; else h = next;
                link(cur, next);
                cur = next;
            }
            next = cur->sibling;
        }
        return h;
    }

    void insert(int key) { head = unite(head, new BNode(key)); }

    int minimum() const {
        int best = head->key;
        for (BNode* n = head; n; n = n->sibling) best = min(best, n->key);
        return best;
    }

    int extract_min() {
        BNode *target = head, *target_prev = nullptr, *prev = nullptr;
        for (BNode* n = head; n; prev = n, n = n->sibling)
            if (n->key < target->key) { target = n; target_prev = prev; }
        if (target_prev) target_prev->sibling = target->sibling;
        else head = target->sibling;
        BNode *kid = target->child, *reversed = nullptr;
        while (kid) {
            BNode* next = kid->sibling;
            kid->sibling = reversed;
            kid->parent = nullptr;
            reversed = kid;
            kid = next;
        }
        int key = target->key;
        delete target;
        head = unite(head, reversed);
        return key;
    }
};`,
    `class BNode:
    def __init__(self, key):
        self.key = key
        self.degree = 0
        self.parent = None
        self.child = None
        self.sibling = None


class BinomialHeap:
    def __init__(self):
        self.head = None

    @staticmethod
    def link(y, z):
        """y becomes a child of z; both had equal degree."""
        y.parent = z
        y.sibling = z.child
        z.child = y
        z.degree += 1

    @staticmethod
    def merge(a, b):
        dummy = BNode(0)
        tail = dummy
        while a and b:
            if a.degree <= b.degree:
                tail.sibling, a = a, a.sibling
            else:
                tail.sibling, b = b, b.sibling
            tail = tail.sibling
        tail.sibling = a or b
        return dummy.sibling

    def union(self, other_head):
        head = self.merge(self.head, other_head)
        self.head = head
        if head is None:
            return
        prev, cur = None, head
        nxt = cur.sibling
        while nxt:
            same = cur.degree == nxt.degree
            triple = nxt.sibling and nxt.sibling.degree == cur.degree
            if not same or triple:
                prev, cur = cur, nxt
            elif cur.key <= nxt.key:
                cur.sibling = nxt.sibling
                self.link(nxt, cur)
            else:
                if prev:
                    prev.sibling = nxt
                else:
                    head = nxt
                self.link(cur, nxt)
                cur = nxt
            nxt = cur.sibling
        self.head = head

    def insert(self, key):
        self.union(BNode(key))
        return self

    def minimum(self):
        best, node = None, self.head
        while node:
            if best is None or node.key < best:
                best = node.key
            node = node.sibling
        return best

    def extract_min(self):
        if self.head is None:
            return None
        target, target_prev, prev, node = self.head, None, None, self.head
        while node:
            if node.key < target.key:
                target, target_prev = node, prev
            prev, node = node, node.sibling
        if target_prev:
            target_prev.sibling = target.sibling
        else:
            self.head = target.sibling
        kid, reversed_kids = target.child, None
        while kid:
            nxt = kid.sibling
            kid.sibling, kid.parent = reversed_kids, None
            reversed_kids = kid
            kid = nxt
        self.union(reversed_kids)
        return target.key`,
    `class BNode {
    int key, degree;
    BNode parent, child, sibling;
    BNode(int key) { this.key = key; }
}

class BinomialHeap {
    BNode head;

    // y becomes a child of z (equal degrees)
    static void link(BNode y, BNode z) {
        y.parent = z;
        y.sibling = z.child;
        z.child = y;
        z.degree++;
    }

    static BNode merge(BNode a, BNode b) {
        BNode dummy = new BNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.degree <= b.degree) { tail.sibling = a; a = a.sibling; }
            else { tail.sibling = b; b = b.sibling; }
            tail = tail.sibling;
        }
        tail.sibling = a != null ? a : b;
        return dummy.sibling;
    }

    void union(BNode other) {
        BNode h = merge(head, other);
        head = h;
        if (h == null) return;
        BNode prev = null, cur = h, next = cur.sibling;
        while (next != null) {
            boolean triple = next.sibling != null && next.sibling.degree == cur.degree;
            if (cur.degree != next.degree || triple) {
                prev = cur;
                cur = next;
            } else if (cur.key <= next.key) {
                cur.sibling = next.sibling;
                link(next, cur);
            } else {
                if (prev != null) prev.sibling = next; else h = next;
                link(cur, next);
                cur = next;
            }
            next = cur.sibling;
        }
        head = h;
    }

    void insert(int key) { union(new BNode(key)); }

    int extractMin() {
        BNode target = head, targetPrev = null, prev = null;
        for (BNode n = head; n != null; prev = n, n = n.sibling)
            if (n.key < target.key) { target = n; targetPrev = prev; }
        if (targetPrev != null) targetPrev.sibling = target.sibling;
        else head = target.sibling;
        BNode kid = target.child, reversed = null;
        while (kid != null) {
            BNode next = kid.sibling;
            kid.sibling = reversed;
            kid.parent = null;
            reversed = kid;
            kid = next;
        }
        union(reversed);
        return target.key;
    }
}`,
    `class BNode {
  constructor(key) {
    this.key = key;
    this.degree = 0;
    this.parent = null;
    this.child = null;
    this.sibling = null;
  }
}

class BinomialHeap {
  constructor() {
    this.head = null;
  }

  // y becomes a child of z (equal degrees)
  static link(y, z) {
    y.parent = z;
    y.sibling = z.child;
    z.child = y;
    z.degree++;
  }

  static merge(a, b) {
    const dummy = new BNode(0);
    let tail = dummy;
    while (a && b) {
      if (a.degree <= b.degree) {
        tail.sibling = a;
        a = a.sibling;
      } else {
        tail.sibling = b;
        b = b.sibling;
      }
      tail = tail.sibling;
    }
    tail.sibling = a || b;
    return dummy.sibling;
  }

  union(other) {
    let h = BinomialHeap.merge(this.head, other);
    this.head = h;
    if (!h) return;
    let prev = null;
    let cur = h;
    let next = cur.sibling;
    while (next) {
      const triple = next.sibling && next.sibling.degree === cur.degree;
      if (cur.degree !== next.degree || triple) {
        prev = cur;
        cur = next;
      } else if (cur.key <= next.key) {
        cur.sibling = next.sibling;
        BinomialHeap.link(next, cur);
      } else {
        if (prev) prev.sibling = next;
        else h = next;
        BinomialHeap.link(cur, next);
        cur = next;
      }
      next = cur.sibling;
    }
    this.head = h;
  }

  insert(key) {
    this.union(new BNode(key));
    return this;
  }

  extractMin() {
    if (!this.head) return undefined;
    let target = this.head;
    let targetPrev = null;
    let prev = null;
    for (let n = this.head; n; prev = n, n = n.sibling) {
      if (n.key < target.key) {
        target = n;
        targetPrev = prev;
      }
    }
    if (targetPrev) targetPrev.sibling = target.sibling;
    else this.head = target.sibling;
    let kid = target.child;
    let reversed = null;
    while (kid) {
      const next = kid.sibling;
      kid.sibling = reversed;
      kid.parent = null;
      reversed = kid;
      kid = next;
    }
    this.union(reversed);
    return target.key;
  }
}`,
    `class BNode {
    public int Key;
    public int Degree;
    public BNode? Parent, Child, Sibling;
    public BNode(int key) { Key = key; }
}

class BinomialHeap {
    BNode? head;

    // y becomes a child of z (equal degrees)
    static void Link(BNode y, BNode z) {
        y.Parent = z;
        y.Sibling = z.Child;
        z.Child = y;
        z.Degree++;
    }

    static BNode? Merge(BNode? a, BNode? b) {
        var dummy = new BNode(0);
        BNode tail = dummy;
        while (a != null && b != null) {
            if (a.Degree <= b.Degree) { tail.Sibling = a; a = a.Sibling; }
            else { tail.Sibling = b; b = b.Sibling; }
            tail = tail.Sibling!;
        }
        tail.Sibling = a ?? b;
        return dummy.Sibling;
    }

    void Union(BNode? other) {
        BNode? h = Merge(head, other);
        head = h;
        if (h == null) return;
        BNode? prev = null;
        BNode cur = h;
        BNode? next = cur.Sibling;
        while (next != null) {
            bool triple = next.Sibling != null && next.Sibling.Degree == cur.Degree;
            if (cur.Degree != next.Degree || triple) {
                prev = cur;
                cur = next;
            } else if (cur.Key <= next.Key) {
                cur.Sibling = next.Sibling;
                Link(next, cur);
            } else {
                if (prev != null) prev.Sibling = next; else h = next;
                Link(cur, next);
                cur = next;
            }
            next = cur.Sibling;
        }
        head = h;
    }

    public void Insert(int key) => Union(new BNode(key));

    public int ExtractMin() {
        BNode target = head!;
        BNode? targetPrev = null, prev = null;
        for (BNode? n = head; n != null; prev = n, n = n.Sibling)
            if (n.Key < target.Key) { target = n; targetPrev = prev; }
        if (targetPrev != null) targetPrev.Sibling = target.Sibling;
        else head = target.Sibling;
        BNode? kid = target.Child, reversed = null;
        while (kid != null) {
            BNode? next = kid.Sibling;
            kid.Sibling = reversed;
            kid.Parent = null;
            reversed = kid;
            kid = next;
        }
        Union(reversed);
        return target.Key;
    }
}`,
  ),

  "fibonacci-heap": snippets(
    `typedef struct FibNode {
    int key, degree, mark;
    struct FibNode *parent, *child, *sibling;
} FibNode;

typedef struct { FibNode *roots, *min; int count; } FibHeap;

FibNode* fib_node(int key) {
    FibNode* n = (FibNode*)calloc(1, sizeof(FibNode));
    n->key = key;
    return n;
}

void fib_push_root(FibHeap* h, FibNode* n) {
    n->parent = NULL;
    n->mark = 0;
    n->sibling = h->roots;
    h->roots = n;
    if (!h->min || n->key < h->min->key) h->min = n;
}

FibNode* fib_insert(FibHeap* h, int key) {
    FibNode* n = fib_node(key);
    fib_push_root(h, n);
    h->count++;
    return n;
}

static void fib_add_child(FibNode* parent, FibNode* child) {
    child->parent = parent;
    child->mark = 0;
    child->sibling = parent->child;
    parent->child = child;
    parent->degree++;
}

void fib_consolidate(FibHeap* h) {
    FibNode* table[64];
    for (int i = 0; i < 64; i++) table[i] = NULL;
    FibNode* cur = h->roots;
    h->roots = NULL;
    h->min = NULL;
    while (cur) {
        FibNode* node = cur;
        cur = cur->sibling;
        node->sibling = NULL;
        while (table[node->degree]) {
            FibNode* other = table[node->degree];
            table[node->degree] = NULL;
            if (other->key < node->key) { FibNode* t = node; node = other; other = t; }
            fib_add_child(node, other);
        }
        table[node->degree] = node;
    }
    for (int d = 0; d < 64; d++) if (table[d]) fib_push_root(h, table[d]);
}

int fib_extract_min(FibHeap* h, int* out) {
    if (!h->min) return 0;
    FibNode* target = h->min;
    FibNode* prev = NULL;
    for (FibNode* n = h->roots; n && n != target; prev = n, n = n->sibling) { }
    if (prev) prev->sibling = target->sibling; else h->roots = target->sibling;
    FibNode* kid = target->child;
    while (kid) {
        FibNode* next = kid->sibling;
        fib_push_root(h, kid);
        kid = next;
    }
    *out = target->key;
    free(target);
    h->count--;
    h->min = NULL;
    fib_consolidate(h);
    return 1;
}

void fib_cut(FibHeap* h, FibNode* node, FibNode* parent) {
    FibNode* prev = NULL;
    for (FibNode* c = parent->child; c && c != node; prev = c, c = c->sibling) { }
    if (prev) prev->sibling = node->sibling; else parent->child = node->sibling;
    parent->degree--;
    fib_push_root(h, node);
}

void fib_cascading_cut(FibHeap* h, FibNode* node) {
    FibNode* parent = node->parent;
    if (!parent) return;
    if (!node->mark) { node->mark = 1; return; }
    fib_cut(h, node, parent);
    fib_cascading_cut(h, parent);
}

void fib_decrease_key(FibHeap* h, FibNode* node, int key) {
    if (key > node->key) return;
    node->key = key;
    FibNode* parent = node->parent;
    if (parent && node->key < parent->key) {
        fib_cut(h, node, parent);
        fib_cascading_cut(h, parent);
    }
    if (!h->min || node->key < h->min->key) h->min = node;
}`,
    `struct FibNode {
    int key, degree = 0;
    bool mark = false;
    FibNode* parent = nullptr;
    vector<FibNode*> kids;
    explicit FibNode(int k) : key(k) {}
};

struct FibonacciHeap {
    vector<FibNode*> roots;
    FibNode* min_node = nullptr;
    int count = 0;

    FibNode* insert(int key) {
        FibNode* n = new FibNode(key);
        roots.push_back(n);
        if (!min_node || key < min_node->key) min_node = n;
        count++;
        return n;
    }

    void drop_root(FibNode* n) {
        roots.erase(remove(roots.begin(), roots.end(), n), roots.end());
    }

    void consolidate() {
        unordered_map<int, FibNode*> table;
        vector<FibNode*> snapshot = roots;
        for (FibNode* start : snapshot) {
            FibNode* node = start;
            while (table.count(node->degree)) {
                FibNode* other = table[node->degree];
                table.erase(node->degree);
                if (other->key < node->key) swap(node, other);
                other->parent = node;
                other->mark = false;
                node->kids.push_back(other);
                node->degree++;
            }
            table[node->degree] = node;
        }
        roots.clear();
        min_node = nullptr;
        for (auto& [deg, node] : table) {
            node->parent = nullptr;
            roots.push_back(node);
            if (!min_node || node->key < min_node->key) min_node = node;
        }
    }

    int extract_min() {
        FibNode* target = min_node;
        drop_root(target);
        for (FibNode* kid : target->kids) {
            kid->parent = nullptr;
            kid->mark = false;
            roots.push_back(kid);
        }
        count--;
        int key = target->key;
        delete target;
        min_node = nullptr;
        consolidate();
        return key;
    }

    void cut(FibNode* node, FibNode* parent) {
        parent->kids.erase(remove(parent->kids.begin(), parent->kids.end(), node),
                           parent->kids.end());
        parent->degree--;
        node->parent = nullptr;
        node->mark = false;
        roots.push_back(node);
    }

    void cascading_cut(FibNode* node) {
        FibNode* parent = node->parent;
        if (!parent) return;
        if (!node->mark) { node->mark = true; return; }
        cut(node, parent);
        cascading_cut(parent);
    }

    void decrease_key(FibNode* node, int key) {
        if (key > node->key) return;
        node->key = key;
        FibNode* parent = node->parent;
        if (parent && node->key < parent->key) {
            cut(node, parent);
            cascading_cut(parent);
        }
        if (!min_node || node->key < min_node->key) min_node = node;
    }
};`,
    `class FibNode:
    def __init__(self, key):
        self.key = key
        self.degree = 0
        self.mark = False
        self.parent = None
        self.kids = []


class FibonacciHeap:
    def __init__(self):
        self.roots = []
        self.min = None
        self.count = 0

    def insert(self, key):
        node = FibNode(key)
        self.roots.append(node)
        if self.min is None or key < self.min.key:
            self.min = node
        self.count += 1
        return node

    def merge(self, other):
        self.roots.extend(other.roots)
        if other.min and (self.min is None or other.min.key < self.min.key):
            self.min = other.min
        self.count += other.count

    def extract_min(self):
        if self.min is None:
            return None
        target = self.min
        self.roots.remove(target)
        for kid in target.kids:
            kid.parent = None
            kid.mark = False
            self.roots.append(kid)
        target.kids = []
        self.count -= 1
        self._consolidate()
        return target.key

    def _consolidate(self):
        table = {}
        for start in list(self.roots):
            node = start
            while node.degree in table:
                other = table.pop(node.degree)
                if other.key < node.key:
                    node, other = other, node
                other.parent = node
                other.mark = False
                node.kids.append(other)
                node.degree += 1
            table[node.degree] = node
        self.roots = list(table.values())
        for node in self.roots:
            node.parent = None
        self.min = min(self.roots, key=lambda n: n.key) if self.roots else None

    def decrease_key(self, node, key):
        if key > node.key:
            raise ValueError("new key is greater than current key")
        node.key = key
        parent = node.parent
        if parent is not None and node.key < parent.key:
            self._cut(node, parent)
            self._cascading_cut(parent)
        if self.min is None or node.key < self.min.key:
            self.min = node

    def _cut(self, node, parent):
        parent.kids.remove(node)
        parent.degree -= 1
        node.parent = None
        node.mark = False
        self.roots.append(node)

    def _cascading_cut(self, node):
        parent = node.parent
        if parent is None:
            return
        if not node.mark:
            node.mark = True
            return
        self._cut(node, parent)
        self._cascading_cut(parent)`,
    `class FibNode {
    int key, degree;
    boolean mark;
    FibNode parent;
    List<FibNode> kids = new ArrayList<>();
    FibNode(int key) { this.key = key; }
}

class FibonacciHeap {
    List<FibNode> roots = new ArrayList<>();
    FibNode min;
    int count;

    FibNode insert(int key) {
        FibNode node = new FibNode(key);
        roots.add(node);
        if (min == null || key < min.key) min = node;
        count++;
        return node;
    }

    int extractMin() {
        FibNode target = min;
        roots.remove(target);
        for (FibNode kid : target.kids) {
            kid.parent = null;
            kid.mark = false;
            roots.add(kid);
        }
        target.kids.clear();
        count--;
        consolidate();
        return target.key;
    }

    private void consolidate() {
        Map<Integer, FibNode> table = new HashMap<>();
        for (FibNode start : new ArrayList<>(roots)) {
            FibNode node = start;
            while (table.containsKey(node.degree)) {
                FibNode other = table.remove(node.degree);
                if (other.key < node.key) { FibNode t = node; node = other; other = t; }
                other.parent = node;
                other.mark = false;
                node.kids.add(other);
                node.degree++;
            }
            table.put(node.degree, node);
        }
        roots = new ArrayList<>(table.values());
        min = null;
        for (FibNode node : roots) {
            node.parent = null;
            if (min == null || node.key < min.key) min = node;
        }
    }

    void decreaseKey(FibNode node, int key) {
        if (key > node.key) throw new IllegalArgumentException("key increased");
        node.key = key;
        FibNode parent = node.parent;
        if (parent != null && node.key < parent.key) {
            cut(node, parent);
            cascadingCut(parent);
        }
        if (min == null || node.key < min.key) min = node;
    }

    private void cut(FibNode node, FibNode parent) {
        parent.kids.remove(node);
        parent.degree--;
        node.parent = null;
        node.mark = false;
        roots.add(node);
    }

    private void cascadingCut(FibNode node) {
        FibNode parent = node.parent;
        if (parent == null) return;
        if (!node.mark) { node.mark = true; return; }
        cut(node, parent);
        cascadingCut(parent);
    }
}`,
    `class FibNode {
  constructor(key) {
    this.key = key;
    this.degree = 0;
    this.mark = false;
    this.parent = null;
    this.kids = [];
  }
}

class FibonacciHeap {
  constructor() {
    this.roots = [];
    this.min = null;
    this.count = 0;
  }

  insert(key) {
    const node = new FibNode(key);
    this.roots.push(node);
    if (!this.min || key < this.min.key) this.min = node;
    this.count++;
    return node;
  }

  dropRoot(node) {
    this.roots = this.roots.filter((n) => n !== node);
  }

  extractMin() {
    if (!this.min) return undefined;
    const target = this.min;
    this.dropRoot(target);
    for (const kid of target.kids) {
      kid.parent = null;
      kid.mark = false;
      this.roots.push(kid);
    }
    target.kids = [];
    this.count--;
    this.consolidate();
    return target.key;
  }

  consolidate() {
    const table = new Map();
    for (const start of [...this.roots]) {
      let node = start;
      while (table.has(node.degree)) {
        let other = table.get(node.degree);
        table.delete(node.degree);
        if (other.key < node.key) [node, other] = [other, node];
        other.parent = node;
        other.mark = false;
        node.kids.push(other);
        node.degree++;
      }
      table.set(node.degree, node);
    }
    this.roots = [...table.values()];
    this.min = null;
    for (const node of this.roots) {
      node.parent = null;
      if (!this.min || node.key < this.min.key) this.min = node;
    }
  }

  decreaseKey(node, key) {
    if (key > node.key) throw new Error("key increased");
    node.key = key;
    const parent = node.parent;
    if (parent && node.key < parent.key) {
      this.cut(node, parent);
      this.cascadingCut(parent);
    }
    if (!this.min || node.key < this.min.key) this.min = node;
  }

  cut(node, parent) {
    parent.kids = parent.kids.filter((n) => n !== node);
    parent.degree--;
    node.parent = null;
    node.mark = false;
    this.roots.push(node);
  }

  cascadingCut(node) {
    const parent = node.parent;
    if (!parent) return;
    if (!node.mark) {
      node.mark = true;
      return;
    }
    this.cut(node, parent);
    this.cascadingCut(parent);
  }
}`,
    `class FibNode {
    public int Key { get; set; }
    public int Degree { get; set; }
    public bool Mark { get; set; }
    public FibNode? Parent { get; set; }
    public List<FibNode> Kids { get; } = new();
    public FibNode(int key) { Key = key; }
}

class FibonacciHeap {
    List<FibNode> roots = new();
    public FibNode? Min { get; private set; }
    public int Count { get; private set; }

    public FibNode Insert(int key) {
        var node = new FibNode(key);
        roots.Add(node);
        if (Min == null || key < Min.Key) Min = node;
        Count++;
        return node;
    }

    public int ExtractMin() {
        FibNode target = Min!;
        roots.Remove(target);
        foreach (FibNode kid in target.Kids) {
            kid.Parent = null;
            kid.Mark = false;
            roots.Add(kid);
        }
        target.Kids.Clear();
        Count--;
        Consolidate();
        return target.Key;
    }

    void Consolidate() {
        var table = new Dictionary<int, FibNode>();
        foreach (FibNode start in new List<FibNode>(roots)) {
            FibNode node = start;
            while (table.TryGetValue(node.Degree, out FibNode? other)) {
                table.Remove(node.Degree);
                if (other.Key < node.Key) (node, other) = (other, node);
                other.Parent = node;
                other.Mark = false;
                node.Kids.Add(other);
                node.Degree++;
            }
            table[node.Degree] = node;
        }
        roots = new List<FibNode>(table.Values);
        Min = null;
        foreach (FibNode node in roots) {
            node.Parent = null;
            if (Min == null || node.Key < Min.Key) Min = node;
        }
    }

    public void DecreaseKey(FibNode node, int key) {
        if (key > node.Key) throw new ArgumentException("key increased");
        node.Key = key;
        FibNode? parent = node.Parent;
        if (parent != null && node.Key < parent.Key) {
            Cut(node, parent);
            CascadingCut(parent);
        }
        if (Min == null || node.Key < Min.Key) Min = node;
    }

    void Cut(FibNode node, FibNode parent) {
        parent.Kids.Remove(node);
        parent.Degree--;
        node.Parent = null;
        node.Mark = false;
        roots.Add(node);
    }

    void CascadingCut(FibNode node) {
        FibNode? parent = node.Parent;
        if (parent == null) return;
        if (!node.Mark) { node.Mark = true; return; }
        Cut(node, parent);
        CascadingCut(parent);
    }
}`,
  ),

  "radix-trie": snippets(
    `#define ALPHABET 26
#define LABEL_MAX 32

typedef struct RNode {
    char label[LABEL_MAX];
    int is_word;
    struct RNode* kids[ALPHABET];
} RNode;

RNode* rnode_new(const char* label) {
    RNode* n = (RNode*)calloc(1, sizeof(RNode));
    strcpy(n->label, label);
    return n;
}

int common_len(const char* a, const char* b) {
    int i = 0;
    while (a[i] && b[i] && a[i] == b[i]) i++;
    return i;
}

void radix_insert(RNode* node, const char* word) {
    if (!word[0]) { node->is_word = 1; return; }
    int c = word[0] - 'a';
    RNode* kid = node->kids[c];
    if (!kid) {
        kid = rnode_new(word);
        kid->is_word = 1;
        node->kids[c] = kid;
        return;
    }
    int shared = common_len(kid->label, word);
    if (shared == (int)strlen(kid->label)) {
        radix_insert(kid, word + shared);
        return;
    }
    RNode* split = rnode_new("");
    strncpy(split->label, kid->label, shared);
    split->label[shared] = 0;
    char rest[LABEL_MAX];
    strcpy(rest, kid->label + shared);
    strcpy(kid->label, rest);
    split->kids[kid->label[0] - 'a'] = kid;
    node->kids[c] = split;
    if (!word[shared]) {
        split->is_word = 1;
    } else {
        RNode* fresh = rnode_new(word + shared);
        fresh->is_word = 1;
        split->kids[word[shared] - 'a'] = fresh;
    }
}

int radix_search(RNode* node, const char* word) {
    if (!word[0]) return node->is_word;
    RNode* kid = node->kids[word[0] - 'a'];
    if (!kid) return 0;
    int len = (int)strlen(kid->label);
    if (strncmp(kid->label, word, len) != 0) return 0;
    return radix_search(kid, word + len);
}`,
    `struct RNode {
    string label;
    bool is_word = false;
    map<char, RNode*> kids;
    explicit RNode(string lbl = "", bool word = false) : label(move(lbl)), is_word(word) {}
};

struct RadixTrie {
    RNode* root = new RNode();

    static size_t common_len(const string& a, const string& b) {
        size_t i = 0;
        while (i < a.size() && i < b.size() && a[i] == b[i]) i++;
        return i;
    }

    void insert(const string& word) { insert_into(root, word); }

    void insert_into(RNode* node, const string& word) {
        if (word.empty()) { node->is_word = true; return; }
        char first = word[0];
        auto it = node->kids.find(first);
        if (it == node->kids.end()) {
            node->kids[first] = new RNode(word, true);
            return;
        }
        RNode* kid = it->second;
        size_t shared = common_len(kid->label, word);
        if (shared == kid->label.size()) {
            insert_into(kid, word.substr(shared));
            return;
        }
        RNode* split = new RNode(kid->label.substr(0, shared));
        kid->label = kid->label.substr(shared);
        split->kids[kid->label[0]] = kid;
        node->kids[first] = split;
        string rest = word.substr(shared);
        if (rest.empty()) split->is_word = true;
        else split->kids[rest[0]] = new RNode(rest, true);
    }

    bool contains(const string& word) const {
        RNode* node = root;
        string rest = word;
        while (!rest.empty()) {
            auto it = node->kids.find(rest[0]);
            if (it == node->kids.end()) return false;
            RNode* kid = it->second;
            if (rest.compare(0, kid->label.size(), kid->label) != 0) return false;
            node = kid;
            rest = rest.substr(kid->label.size());
        }
        return node->is_word;
    }
};`,
    `class RadixNode:
    def __init__(self, label="", is_word=False):
        self.label = label
        self.is_word = is_word
        self.kids = {}


class RadixTrie:
    def __init__(self, words=None):
        self.root = RadixNode()
        for word in words or []:
            self.insert(word)

    def insert(self, word):
        self._insert(self.root, word)
        return self

    def _insert(self, node, word):
        if not word:
            node.is_word = True
            return
        first = word[0]
        kid = node.kids.get(first)
        if kid is None:
            node.kids[first] = RadixNode(word, True)
            return
        shared = 0
        while (
            shared < len(kid.label)
            and shared < len(word)
            and kid.label[shared] == word[shared]
        ):
            shared += 1
        if shared == len(kid.label):
            self._insert(kid, word[shared:])
            return
        split = RadixNode(kid.label[:shared])
        kid.label = kid.label[shared:]
        split.kids[kid.label[0]] = kid
        node.kids[first] = split
        rest = word[shared:]
        if rest:
            split.kids[rest[0]] = RadixNode(rest, True)
        else:
            split.is_word = True

    def contains(self, word):
        node, rest = self.root, word
        while rest:
            kid = node.kids.get(rest[0])
            if kid is None or not rest.startswith(kid.label):
                return False
            node, rest = kid, rest[len(kid.label) :]
        return node.is_word

    def words(self, node=None, prefix=""):
        node = self.root if node is None else node
        out = [prefix] if node.is_word and prefix else []
        for kid in node.kids.values():
            out.extend(self.words(kid, prefix + kid.label))
        return out`,
    `class RadixNode {
    String label;
    boolean isWord;
    Map<Character, RadixNode> kids = new TreeMap<>();

    RadixNode(String label, boolean isWord) { this.label = label; this.isWord = isWord; }
}

class RadixTrie {
    final RadixNode root = new RadixNode("", false);

    static int commonLen(String a, String b) {
        int i = 0;
        while (i < a.length() && i < b.length() && a.charAt(i) == b.charAt(i)) i++;
        return i;
    }

    void insert(String word) { insert(root, word); }

    private void insert(RadixNode node, String word) {
        if (word.isEmpty()) { node.isWord = true; return; }
        char first = word.charAt(0);
        RadixNode kid = node.kids.get(first);
        if (kid == null) {
            node.kids.put(first, new RadixNode(word, true));
            return;
        }
        int shared = commonLen(kid.label, word);
        if (shared == kid.label.length()) {
            insert(kid, word.substring(shared));
            return;
        }
        RadixNode split = new RadixNode(kid.label.substring(0, shared), false);
        kid.label = kid.label.substring(shared);
        split.kids.put(kid.label.charAt(0), kid);
        node.kids.put(first, split);
        String rest = word.substring(shared);
        if (rest.isEmpty()) split.isWord = true;
        else split.kids.put(rest.charAt(0), new RadixNode(rest, true));
    }

    boolean contains(String word) {
        RadixNode node = root;
        String rest = word;
        while (!rest.isEmpty()) {
            RadixNode kid = node.kids.get(rest.charAt(0));
            if (kid == null || !rest.startsWith(kid.label)) return false;
            node = kid;
            rest = rest.substring(kid.label.length());
        }
        return node.isWord;
    }
}`,
    `class RadixNode {
  constructor(label = "", isWord = false) {
    this.label = label;
    this.isWord = isWord;
    this.kids = new Map();
  }
}

class RadixTrie {
  constructor(words = []) {
    this.root = new RadixNode();
    for (const word of words) this.insert(word);
  }

  static commonLen(a, b) {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return i;
  }

  insert(word) {
    this.insertInto(this.root, word);
    return this;
  }

  insertInto(node, word) {
    if (!word) {
      node.isWord = true;
      return;
    }
    const first = word[0];
    const kid = node.kids.get(first);
    if (!kid) {
      node.kids.set(first, new RadixNode(word, true));
      return;
    }
    const shared = RadixTrie.commonLen(kid.label, word);
    if (shared === kid.label.length) {
      this.insertInto(kid, word.slice(shared));
      return;
    }
    const split = new RadixNode(kid.label.slice(0, shared));
    kid.label = kid.label.slice(shared);
    split.kids.set(kid.label[0], kid);
    node.kids.set(first, split);
    const rest = word.slice(shared);
    if (rest) split.kids.set(rest[0], new RadixNode(rest, true));
    else split.isWord = true;
  }

  contains(word) {
    let node = this.root;
    let rest = word;
    while (rest) {
      const kid = node.kids.get(rest[0]);
      if (!kid || !rest.startsWith(kid.label)) return false;
      node = kid;
      rest = rest.slice(kid.label.length);
    }
    return node.isWord;
  }
}`,
    `class RadixNode {
    public string Label { get; set; }
    public bool IsWord { get; set; }
    public SortedDictionary<char, RadixNode> Kids { get; } = new();

    public RadixNode(string label = "", bool isWord = false) {
        Label = label;
        IsWord = isWord;
    }
}

class RadixTrie {
    public RadixNode Root { get; } = new RadixNode();

    static int CommonLen(string a, string b) {
        int i = 0;
        while (i < a.Length && i < b.Length && a[i] == b[i]) i++;
        return i;
    }

    public void Insert(string word) => InsertInto(Root, word);

    void InsertInto(RadixNode node, string word) {
        if (word.Length == 0) { node.IsWord = true; return; }
        char first = word[0];
        if (!node.Kids.TryGetValue(first, out RadixNode? kid)) {
            node.Kids[first] = new RadixNode(word, true);
            return;
        }
        int shared = CommonLen(kid.Label, word);
        if (shared == kid.Label.Length) {
            InsertInto(kid, word[shared..]);
            return;
        }
        var split = new RadixNode(kid.Label[..shared]);
        kid.Label = kid.Label[shared..];
        split.Kids[kid.Label[0]] = kid;
        node.Kids[first] = split;
        string rest = word[shared..];
        if (rest.Length == 0) split.IsWord = true;
        else split.Kids[rest[0]] = new RadixNode(rest, true);
    }

    public bool Contains(string word) {
        RadixNode node = Root;
        string rest = word;
        while (rest.Length > 0) {
            if (!node.Kids.TryGetValue(rest[0], out RadixNode? kid)) return false;
            if (!rest.StartsWith(kid.Label)) return false;
            node = kid;
            rest = rest[kid.Label.Length..];
        }
        return node.IsWord;
    }
}`,
  ),

  tst: snippets(
    `typedef struct TSTNode {
    char ch;
    int is_word;
    struct TSTNode *left, *mid, *right;
} TSTNode;

TSTNode* tst_node(char ch) {
    TSTNode* n = (TSTNode*)calloc(1, sizeof(TSTNode));
    n->ch = ch;
    return n;
}

TSTNode* tst_put(TSTNode* node, const char* key, int d) {
    char ch = key[d];
    if (!node) node = tst_node(ch);
    if (ch < node->ch) node->left = tst_put(node->left, key, d);
    else if (ch > node->ch) node->right = tst_put(node->right, key, d);
    else if (key[d + 1]) node->mid = tst_put(node->mid, key, d + 1);
    else node->is_word = 1;
    return node;
}

TSTNode* tst_get(TSTNode* node, const char* key, int d) {
    if (!node) return NULL;
    char ch = key[d];
    if (ch < node->ch) return tst_get(node->left, key, d);
    if (ch > node->ch) return tst_get(node->right, key, d);
    if (key[d + 1]) return tst_get(node->mid, key, d + 1);
    return node;
}

int tst_contains(TSTNode* root, const char* key) {
    TSTNode* n = tst_get(root, key, 0);
    return n && n->is_word;
}

void tst_collect(TSTNode* node, char* buf, int depth, void (*emit)(const char*)) {
    if (!node) return;
    tst_collect(node->left, buf, depth, emit);
    buf[depth] = node->ch;
    if (node->is_word) { buf[depth + 1] = 0; emit(buf); }
    tst_collect(node->mid, buf, depth + 1, emit);
    tst_collect(node->right, buf, depth, emit);
}`,
    `struct TSTNode {
    char ch;
    bool is_word = false;
    TSTNode *left = nullptr, *mid = nullptr, *right = nullptr;
    explicit TSTNode(char c) : ch(c) {}
};

struct TernarySearchTree {
    TSTNode* root = nullptr;

    void insert(const string& key) {
        if (!key.empty()) root = put(root, key, 0);
    }

    TSTNode* put(TSTNode* node, const string& key, size_t d) {
        char ch = key[d];
        if (!node) node = new TSTNode(ch);
        if (ch < node->ch) node->left = put(node->left, key, d);
        else if (ch > node->ch) node->right = put(node->right, key, d);
        else if (d + 1 < key.size()) node->mid = put(node->mid, key, d + 1);
        else node->is_word = true;
        return node;
    }

    TSTNode* get(TSTNode* node, const string& key, size_t d) const {
        if (!node) return nullptr;
        char ch = key[d];
        if (ch < node->ch) return get(node->left, key, d);
        if (ch > node->ch) return get(node->right, key, d);
        if (d + 1 < key.size()) return get(node->mid, key, d + 1);
        return node;
    }

    bool contains(const string& key) const {
        TSTNode* n = key.empty() ? nullptr : get(root, key, 0);
        return n && n->is_word;
    }

    void collect(TSTNode* node, string prefix, vector<string>& out) const {
        if (!node) return;
        collect(node->left, prefix, out);
        if (node->is_word) out.push_back(prefix + node->ch);
        collect(node->mid, prefix + node->ch, out);
        collect(node->right, prefix, out);
    }

    vector<string> with_prefix(const string& prefix) const {
        vector<string> out;
        TSTNode* start = prefix.empty() ? root : get(root, prefix, 0);
        if (!start) return out;
        if (prefix.empty()) { collect(root, "", out); return out; }
        if (start->is_word) out.push_back(prefix);
        collect(start->mid, prefix, out);
        return out;
    }
};`,
    `class TSTNode:
    def __init__(self, ch):
        self.ch = ch
        self.is_word = False
        self.left = None
        self.mid = None
        self.right = None


class TernarySearchTree:
    def __init__(self, words=None):
        self.root = None
        for word in words or []:
            self.insert(word)

    def insert(self, key):
        if key:
            self.root = self._put(self.root, key, 0)
        return self

    def _put(self, node, key, d):
        ch = key[d]
        if node is None:
            node = TSTNode(ch)
        if ch < node.ch:
            node.left = self._put(node.left, key, d)
        elif ch > node.ch:
            node.right = self._put(node.right, key, d)
        elif d < len(key) - 1:
            node.mid = self._put(node.mid, key, d + 1)
        else:
            node.is_word = True
        return node

    def _get(self, node, key, d):
        if node is None:
            return None
        ch = key[d]
        if ch < node.ch:
            return self._get(node.left, key, d)
        if ch > node.ch:
            return self._get(node.right, key, d)
        if d < len(key) - 1:
            return self._get(node.mid, key, d + 1)
        return node

    def contains(self, key):
        node = self._get(self.root, key, 0) if key else None
        return node is not None and node.is_word

    def with_prefix(self, prefix):
        out = []
        if not prefix:
            self._collect(self.root, "", out)
            return out
        start = self._get(self.root, prefix, 0)
        if start is None:
            return out
        if start.is_word:
            out.append(prefix)
        self._collect(start.mid, prefix, out)
        return out

    def _collect(self, node, prefix, out):
        if node is None:
            return
        self._collect(node.left, prefix, out)
        if node.is_word:
            out.append(prefix + node.ch)
        self._collect(node.mid, prefix + node.ch, out)
        self._collect(node.right, prefix, out)`,
    `class TSTNode {
    char ch;
    boolean isWord;
    TSTNode left, mid, right;
    TSTNode(char ch) { this.ch = ch; }
}

class TernarySearchTree {
    TSTNode root;

    void insert(String key) {
        if (!key.isEmpty()) root = put(root, key, 0);
    }

    private TSTNode put(TSTNode node, String key, int d) {
        char ch = key.charAt(d);
        if (node == null) node = new TSTNode(ch);
        if (ch < node.ch) node.left = put(node.left, key, d);
        else if (ch > node.ch) node.right = put(node.right, key, d);
        else if (d < key.length() - 1) node.mid = put(node.mid, key, d + 1);
        else node.isWord = true;
        return node;
    }

    private TSTNode get(TSTNode node, String key, int d) {
        if (node == null) return null;
        char ch = key.charAt(d);
        if (ch < node.ch) return get(node.left, key, d);
        if (ch > node.ch) return get(node.right, key, d);
        if (d < key.length() - 1) return get(node.mid, key, d + 1);
        return node;
    }

    boolean contains(String key) {
        if (key.isEmpty()) return false;
        TSTNode n = get(root, key, 0);
        return n != null && n.isWord;
    }

    List<String> withPrefix(String prefix) {
        List<String> out = new ArrayList<>();
        if (prefix.isEmpty()) { collect(root, "", out); return out; }
        TSTNode start = get(root, prefix, 0);
        if (start == null) return out;
        if (start.isWord) out.add(prefix);
        collect(start.mid, prefix, out);
        return out;
    }

    private void collect(TSTNode node, String prefix, List<String> out) {
        if (node == null) return;
        collect(node.left, prefix, out);
        if (node.isWord) out.add(prefix + node.ch);
        collect(node.mid, prefix + node.ch, out);
        collect(node.right, prefix, out);
    }
}`,
    `class TSTNode {
  constructor(ch) {
    this.ch = ch;
    this.isWord = false;
    this.left = null;
    this.mid = null;
    this.right = null;
  }
}

class TernarySearchTree {
  constructor(words = []) {
    this.root = null;
    for (const word of words) this.insert(word);
  }

  insert(key) {
    if (key) this.root = this.put(this.root, key, 0);
    return this;
  }

  put(node, key, d) {
    const ch = key[d];
    if (!node) node = new TSTNode(ch);
    if (ch < node.ch) node.left = this.put(node.left, key, d);
    else if (ch > node.ch) node.right = this.put(node.right, key, d);
    else if (d < key.length - 1) node.mid = this.put(node.mid, key, d + 1);
    else node.isWord = true;
    return node;
  }

  get(node, key, d) {
    if (!node) return null;
    const ch = key[d];
    if (ch < node.ch) return this.get(node.left, key, d);
    if (ch > node.ch) return this.get(node.right, key, d);
    if (d < key.length - 1) return this.get(node.mid, key, d + 1);
    return node;
  }

  contains(key) {
    const node = key ? this.get(this.root, key, 0) : null;
    return Boolean(node && node.isWord);
  }

  withPrefix(prefix) {
    const out = [];
    const collect = (node, buf) => {
      if (!node) return;
      collect(node.left, buf);
      if (node.isWord) out.push(buf + node.ch);
      collect(node.mid, buf + node.ch);
      collect(node.right, buf);
    };
    if (!prefix) {
      collect(this.root, "");
      return out;
    }
    const start = this.get(this.root, prefix, 0);
    if (!start) return out;
    if (start.isWord) out.push(prefix);
    collect(start.mid, prefix);
    return out;
  }
}`,
    `class TSTNode {
    public char Ch { get; }
    public bool IsWord { get; set; }
    public TSTNode? Left, Mid, Right;
    public TSTNode(char ch) { Ch = ch; }
}

class TernarySearchTree {
    public TSTNode? Root { get; private set; }

    public void Insert(string key) {
        if (key.Length > 0) Root = Put(Root, key, 0);
    }

    TSTNode Put(TSTNode? node, string key, int d) {
        char ch = key[d];
        node ??= new TSTNode(ch);
        if (ch < node.Ch) node.Left = Put(node.Left, key, d);
        else if (ch > node.Ch) node.Right = Put(node.Right, key, d);
        else if (d < key.Length - 1) node.Mid = Put(node.Mid, key, d + 1);
        else node.IsWord = true;
        return node;
    }

    TSTNode? Get(TSTNode? node, string key, int d) {
        if (node == null) return null;
        char ch = key[d];
        if (ch < node.Ch) return Get(node.Left, key, d);
        if (ch > node.Ch) return Get(node.Right, key, d);
        if (d < key.Length - 1) return Get(node.Mid, key, d + 1);
        return node;
    }

    public bool Contains(string key) {
        TSTNode? n = key.Length == 0 ? null : Get(Root, key, 0);
        return n != null && n.IsWord;
    }

    public List<string> WithPrefix(string prefix) {
        var acc = new List<string>();
        if (prefix.Length == 0) { Collect(Root, "", acc); return acc; }
        TSTNode? start = Get(Root, prefix, 0);
        if (start == null) return acc;
        if (start.IsWord) acc.Add(prefix);
        Collect(start.Mid, prefix, acc);
        return acc;
    }

    void Collect(TSTNode? node, string buf, List<string> acc) {
        if (node == null) return;
        Collect(node.Left, buf, acc);
        if (node.IsWord) acc.Add(buf + node.Ch);
        Collect(node.Mid, buf + node.Ch, acc);
        Collect(node.Right, buf, acc);
    }
}`,
  ),

  fenwick: snippets(
    `typedef struct { int* bit; int n; } Fenwick;

Fenwick* fenwick_new(const int* a, int n) {
    Fenwick* f = (Fenwick*)malloc(sizeof(Fenwick));
    f->n = n;
    f->bit = (int*)calloc(n + 1, sizeof(int));
    for (int i = 0; i < n; i++) {
        f->bit[i + 1] += a[i];
        int parent = (i + 1) + ((i + 1) & -(i + 1));
        if (parent <= n) f->bit[parent] += f->bit[i + 1];
    }
    return f;
}

void fenwick_add(Fenwick* f, int i, int delta) {
    for (int x = i + 1; x <= f->n; x += x & -x) f->bit[x] += delta;
}

int fenwick_prefix(Fenwick* f, int i) {
    int total = 0;
    for (int x = i + 1; x > 0; x -= x & -x) total += f->bit[x];
    return total;
}

int fenwick_range(Fenwick* f, int l, int r) {
    return fenwick_prefix(f, r) - (l > 0 ? fenwick_prefix(f, l - 1) : 0);
}

int fenwick_lower_bound(Fenwick* f, int target) {
    int pos = 0, step = 1;
    while (step * 2 <= f->n) step *= 2;
    for (; step > 0; step /= 2) {
        if (pos + step <= f->n && f->bit[pos + step] < target) {
            pos += step;
            target -= f->bit[pos];
        }
    }
    return pos;
}`,
    `struct Fenwick {
    int n;
    vector<long long> bit;

    explicit Fenwick(int size) : n(size), bit(size + 1, 0) {}

    explicit Fenwick(const vector<int>& a) : n((int)a.size()), bit(a.size() + 1, 0) {
        for (int i = 0; i < n; i++) {
            bit[i + 1] += a[i];
            int parent = (i + 1) + ((i + 1) & -(i + 1));
            if (parent <= n) bit[parent] += bit[i + 1];
        }
    }

    void add(int i, long long delta) {
        for (int x = i + 1; x <= n; x += x & -x) bit[x] += delta;
    }

    long long prefix(int i) const {
        long long total = 0;
        for (int x = i + 1; x > 0; x -= x & -x) total += bit[x];
        return total;
    }

    long long range(int l, int r) const {
        return prefix(r) - (l > 0 ? prefix(l - 1) : 0);
    }

    int lower_bound(long long target) const {
        int pos = 0, step = 1;
        while (step * 2 <= n) step *= 2;
        for (; step > 0; step /= 2) {
            if (pos + step <= n && bit[pos + step] < target) {
                pos += step;
                target -= bit[pos];
            }
        }
        return pos;
    }
};`,
    `class Fenwick:
    def __init__(self, values):
        if isinstance(values, int):
            self.n, values = values, []
            self.bit = [0] * (self.n + 1)
            return
        self.n = len(values)
        self.bit = [0] * (self.n + 1)
        for i, v in enumerate(values):
            self.bit[i + 1] += v
            parent = (i + 1) + ((i + 1) & -(i + 1))
            if parent <= self.n:
                self.bit[parent] += self.bit[i + 1]

    def add(self, i, delta):
        x = i + 1
        while x <= self.n:
            self.bit[x] += delta
            x += x & -x

    def prefix(self, i):
        total, x = 0, i + 1
        while x > 0:
            total += self.bit[x]
            x -= x & -x
        return total

    def range(self, left, right):
        return self.prefix(right) - (self.prefix(left - 1) if left > 0 else 0)

    def lower_bound(self, target):
        pos, step = 0, 1
        while step * 2 <= self.n:
            step *= 2
        while step > 0:
            if pos + step <= self.n and self.bit[pos + step] < target:
                pos += step
                target -= self.bit[pos]
            step //= 2
        return pos`,
    `class Fenwick {
    final int n;
    final long[] bit;

    Fenwick(int size) { n = size; bit = new long[size + 1]; }

    Fenwick(int[] a) {
        n = a.length;
        bit = new long[n + 1];
        for (int i = 0; i < n; i++) {
            bit[i + 1] += a[i];
            int parent = (i + 1) + ((i + 1) & -(i + 1));
            if (parent <= n) bit[parent] += bit[i + 1];
        }
    }

    void add(int i, long delta) {
        for (int x = i + 1; x <= n; x += x & -x) bit[x] += delta;
    }

    long prefix(int i) {
        long total = 0;
        for (int x = i + 1; x > 0; x -= x & -x) total += bit[x];
        return total;
    }

    long range(int l, int r) {
        return prefix(r) - (l > 0 ? prefix(l - 1) : 0);
    }

    int lowerBound(long target) {
        int pos = 0, step = 1;
        while (step * 2 <= n) step *= 2;
        for (; step > 0; step /= 2) {
            if (pos + step <= n && bit[pos + step] < target) {
                pos += step;
                target -= bit[pos];
            }
        }
        return pos;
    }
}`,
    `class Fenwick {
  constructor(values) {
    if (typeof values === "number") {
      this.n = values;
      this.bit = new Array(values + 1).fill(0);
      return;
    }
    this.n = values.length;
    this.bit = new Array(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.bit[i + 1] += values[i];
      const parent = i + 1 + ((i + 1) & -(i + 1));
      if (parent <= this.n) this.bit[parent] += this.bit[i + 1];
    }
  }

  add(i, delta) {
    for (let x = i + 1; x <= this.n; x += x & -x) this.bit[x] += delta;
  }

  prefix(i) {
    let total = 0;
    for (let x = i + 1; x > 0; x -= x & -x) total += this.bit[x];
    return total;
  }

  range(l, r) {
    return this.prefix(r) - (l > 0 ? this.prefix(l - 1) : 0);
  }

  lowerBound(target) {
    let pos = 0;
    let step = 1;
    let need = target;
    while (step * 2 <= this.n) step *= 2;
    for (; step > 0; step >>= 1) {
      if (pos + step <= this.n && this.bit[pos + step] < need) {
        pos += step;
        need -= this.bit[pos];
      }
    }
    return pos;
  }
}`,
    `class Fenwick {
    readonly int n;
    readonly long[] bit;

    public Fenwick(int size) { n = size; bit = new long[size + 1]; }

    public Fenwick(int[] a) {
        n = a.Length;
        bit = new long[n + 1];
        for (int i = 0; i < n; i++) {
            bit[i + 1] += a[i];
            int parent = (i + 1) + ((i + 1) & -(i + 1));
            if (parent <= n) bit[parent] += bit[i + 1];
        }
    }

    public void Add(int i, long delta) {
        for (int x = i + 1; x <= n; x += x & -x) bit[x] += delta;
    }

    public long Prefix(int i) {
        long total = 0;
        for (int x = i + 1; x > 0; x -= x & -x) total += bit[x];
        return total;
    }

    public long Range(int l, int r) => Prefix(r) - (l > 0 ? Prefix(l - 1) : 0);

    public int LowerBound(long target) {
        int pos = 0, step = 1;
        while (step * 2 <= n) step *= 2;
        for (; step > 0; step /= 2) {
            if (pos + step <= n && bit[pos + step] < target) {
                pos += step;
                target -= bit[pos];
            }
        }
        return pos;
    }
}`,
  ),

  "interval-tree": snippets(
    `typedef struct INode {
    int lo, hi, max_hi;
    struct INode *left, *right;
} INode;

INode* inode_new(int lo, int hi) {
    INode* n = (INode*)calloc(1, sizeof(INode));
    n->lo = lo; n->hi = hi; n->max_hi = hi;
    return n;
}

int overlaps(INode* n, int lo, int hi) {
    return n->lo <= hi && lo <= n->hi;
}

INode* interval_insert(INode* root, int lo, int hi) {
    if (!root) return inode_new(lo, hi);
    if (lo < root->lo) root->left = interval_insert(root->left, lo, hi);
    else root->right = interval_insert(root->right, lo, hi);
    if (root->max_hi < hi) root->max_hi = hi;
    return root;
}

/* any single interval overlapping [lo, hi], or NULL */
INode* interval_search(INode* root, int lo, int hi) {
    while (root) {
        if (overlaps(root, lo, hi)) return root;
        if (root->left && root->left->max_hi >= lo) root = root->left;
        else root = root->right;
    }
    return NULL;
}

void interval_collect(INode* n, int lo, int hi, void (*emit)(int, int)) {
    if (!n || n->max_hi < lo) return;
    interval_collect(n->left, lo, hi, emit);
    if (overlaps(n, lo, hi)) emit(n->lo, n->hi);
    if (n->lo <= hi) interval_collect(n->right, lo, hi, emit);
}`,
    `struct INode {
    int lo, hi, max_hi;
    INode *left = nullptr, *right = nullptr;
    INode(int l, int h) : lo(l), hi(h), max_hi(h) {}
};

struct IntervalTree {
    INode* root = nullptr;

    static bool overlaps(INode* n, int lo, int hi) {
        return n->lo <= hi && lo <= n->hi;
    }

    INode* insert(INode* node, int lo, int hi) {
        if (!node) return new INode(lo, hi);
        if (lo < node->lo) node->left = insert(node->left, lo, hi);
        else node->right = insert(node->right, lo, hi);
        node->max_hi = max(node->max_hi, hi);
        return node;
    }

    void insert(int lo, int hi) { root = insert(root, lo, hi); }

    // one overlapping interval, or nullptr
    INode* search(int lo, int hi) const {
        INode* node = root;
        while (node) {
            if (overlaps(node, lo, hi)) return node;
            if (node->left && node->left->max_hi >= lo) node = node->left;
            else node = node->right;
        }
        return nullptr;
    }

    void collect(INode* n, int lo, int hi, vector<pair<int, int>>& out) const {
        if (!n || n->max_hi < lo) return;
        collect(n->left, lo, hi, out);
        if (overlaps(n, lo, hi)) out.push_back({n->lo, n->hi});
        if (n->lo <= hi) collect(n->right, lo, hi, out);
    }

    vector<pair<int, int>> all_overlapping(int lo, int hi) const {
        vector<pair<int, int>> out;
        collect(root, lo, hi, out);
        return out;
    }
};`,
    `class INode:
    def __init__(self, lo, hi):
        self.lo = lo
        self.hi = hi
        self.max_hi = hi
        self.left = None
        self.right = None


class IntervalTree:
    def __init__(self, intervals=None):
        self.root = None
        for lo, hi in intervals or []:
            self.insert(lo, hi)

    @staticmethod
    def overlaps(node, lo, hi):
        return node.lo <= hi and lo <= node.hi

    def insert(self, lo, hi):
        self.root = self._insert(self.root, lo, hi)
        return self

    def _insert(self, node, lo, hi):
        if node is None:
            return INode(lo, hi)
        if lo < node.lo:
            node.left = self._insert(node.left, lo, hi)
        else:
            node.right = self._insert(node.right, lo, hi)
        node.max_hi = max(node.max_hi, hi)
        return node

    def search(self, lo, hi):
        """Any one interval overlapping [lo, hi]."""
        node = self.root
        while node:
            if self.overlaps(node, lo, hi):
                return (node.lo, node.hi)
            if node.left and node.left.max_hi >= lo:
                node = node.left
            else:
                node = node.right
        return None

    def all_overlapping(self, lo, hi):
        out = []
        self._collect(self.root, lo, hi, out)
        return out

    def _collect(self, node, lo, hi, out):
        if node is None or node.max_hi < lo:
            return
        self._collect(node.left, lo, hi, out)
        if self.overlaps(node, lo, hi):
            out.append((node.lo, node.hi))
        if node.lo <= hi:
            self._collect(node.right, lo, hi, out)`,
    `class INode {
    int lo, hi, maxHi;
    INode left, right;
    INode(int lo, int hi) { this.lo = lo; this.hi = hi; maxHi = hi; }
}

class IntervalTree {
    INode root;

    static boolean overlaps(INode n, int lo, int hi) {
        return n.lo <= hi && lo <= n.hi;
    }

    void insert(int lo, int hi) { root = insert(root, lo, hi); }

    private INode insert(INode node, int lo, int hi) {
        if (node == null) return new INode(lo, hi);
        if (lo < node.lo) node.left = insert(node.left, lo, hi);
        else node.right = insert(node.right, lo, hi);
        node.maxHi = Math.max(node.maxHi, hi);
        return node;
    }

    // one overlapping interval, or null
    INode search(int lo, int hi) {
        INode node = root;
        while (node != null) {
            if (overlaps(node, lo, hi)) return node;
            if (node.left != null && node.left.maxHi >= lo) node = node.left;
            else node = node.right;
        }
        return null;
    }

    List<int[]> allOverlapping(int lo, int hi) {
        List<int[]> out = new ArrayList<>();
        collect(root, lo, hi, out);
        return out;
    }

    private void collect(INode n, int lo, int hi, List<int[]> out) {
        if (n == null || n.maxHi < lo) return;
        collect(n.left, lo, hi, out);
        if (overlaps(n, lo, hi)) out.add(new int[] { n.lo, n.hi });
        if (n.lo <= hi) collect(n.right, lo, hi, out);
    }
}`,
    `class INode {
  constructor(lo, hi) {
    this.lo = lo;
    this.hi = hi;
    this.maxHi = hi;
    this.left = null;
    this.right = null;
  }
}

class IntervalTree {
  constructor(intervals = []) {
    this.root = null;
    for (const [lo, hi] of intervals) this.insert(lo, hi);
  }

  static overlaps(node, lo, hi) {
    return node.lo <= hi && lo <= node.hi;
  }

  insert(lo, hi) {
    const add = (node) => {
      if (!node) return new INode(lo, hi);
      if (lo < node.lo) node.left = add(node.left);
      else node.right = add(node.right);
      node.maxHi = Math.max(node.maxHi, hi);
      return node;
    };
    this.root = add(this.root);
    return this;
  }

  // one overlapping interval, or null
  search(lo, hi) {
    let node = this.root;
    while (node) {
      if (IntervalTree.overlaps(node, lo, hi)) return [node.lo, node.hi];
      if (node.left && node.left.maxHi >= lo) node = node.left;
      else node = node.right;
    }
    return null;
  }

  allOverlapping(lo, hi) {
    const out = [];
    const walk = (node) => {
      if (!node || node.maxHi < lo) return;
      walk(node.left);
      if (IntervalTree.overlaps(node, lo, hi)) out.push([node.lo, node.hi]);
      if (node.lo <= hi) walk(node.right);
    };
    walk(this.root);
    return out;
  }
}`,
    `class INode {
    public int Lo, Hi, MaxHi;
    public INode? Left, Right;
    public INode(int lo, int hi) { Lo = lo; Hi = hi; MaxHi = hi; }
}

class IntervalTree {
    public INode? Root { get; private set; }

    static bool Overlaps(INode n, int lo, int hi) => n.Lo <= hi && lo <= n.Hi;

    public void Insert(int lo, int hi) { Root = Insert(Root, lo, hi); }

    static INode Insert(INode? node, int lo, int hi) {
        if (node == null) return new INode(lo, hi);
        if (lo < node.Lo) node.Left = Insert(node.Left, lo, hi);
        else node.Right = Insert(node.Right, lo, hi);
        node.MaxHi = Math.Max(node.MaxHi, hi);
        return node;
    }

    // one overlapping interval, or null
    public INode? Search(int lo, int hi) {
        INode? node = Root;
        while (node != null) {
            if (Overlaps(node, lo, hi)) return node;
            if (node.Left != null && node.Left.MaxHi >= lo) node = node.Left;
            else node = node.Right;
        }
        return null;
    }

    public List<(int Lo, int Hi)> AllOverlapping(int lo, int hi) {
        var acc = new List<(int, int)>();
        Collect(Root, lo, hi, acc);
        return acc;
    }

    static void Collect(INode? n, int lo, int hi, List<(int, int)> acc) {
        if (n == null || n.MaxHi < lo) return;
        Collect(n.Left, lo, hi, acc);
        if (Overlaps(n, lo, hi)) acc.Add((n.Lo, n.Hi));
        if (n.Lo <= hi) Collect(n.Right, lo, hi, acc);
    }
}`,
  ),

  "suffix-tree": snippets(
    `#define ALPHABET 128
#define LABEL_MAX 64

/* compressed suffix tree built by inserting every suffix of the text */
typedef struct SNode {
    char label[LABEL_MAX];
    int terminal;
    struct SNode* kids[ALPHABET];
} SNode;

SNode* snode_new(const char* label) {
    SNode* n = (SNode*)calloc(1, sizeof(SNode));
    strcpy(n->label, label);
    return n;
}

int shared_len(const char* a, const char* b) {
    int i = 0;
    while (a[i] && b[i] && a[i] == b[i]) i++;
    return i;
}

void suffix_add(SNode* node, const char* suffix) {
    if (!suffix[0]) { node->terminal = 1; return; }
    unsigned char c = (unsigned char)suffix[0];
    SNode* kid = node->kids[c];
    if (!kid) {
        kid = snode_new(suffix);
        kid->terminal = 1;
        node->kids[c] = kid;
        return;
    }
    int shared = shared_len(kid->label, suffix);
    if (shared == (int)strlen(kid->label)) {
        suffix_add(kid, suffix + shared);
        return;
    }
    SNode* split = snode_new("");
    strncpy(split->label, kid->label, shared);
    split->label[shared] = 0;
    char rest[LABEL_MAX];
    strcpy(rest, kid->label + shared);
    strcpy(kid->label, rest);
    split->kids[(unsigned char)kid->label[0]] = kid;
    node->kids[c] = split;
    if (!suffix[shared]) {
        split->terminal = 1;
    } else {
        SNode* fresh = snode_new(suffix + shared);
        fresh->terminal = 1;
        split->kids[(unsigned char)suffix[shared]] = fresh;
    }
}

SNode* suffix_tree_build(const char* text) {
    SNode* root = snode_new("");
    int n = (int)strlen(text);
    for (int i = 0; i < n; i++) suffix_add(root, text + i);
    return root;
}

int suffix_contains(SNode* root, const char* pattern) {
    SNode* node = root;
    const char* rest = pattern;
    while (rest[0]) {
        SNode* kid = node->kids[(unsigned char)rest[0]];
        if (!kid) return 0;
        int len = (int)strlen(kid->label);
        int r = (int)strlen(rest);
        int cmp = len < r ? len : r;
        if (strncmp(kid->label, rest, cmp) != 0) return 0;
        node = kid;
        rest += cmp;
    }
    return 1;
}`,
    `// compressed suffix tree built by inserting every suffix
struct SNode {
    string label;
    bool terminal = false;
    map<char, SNode*> kids;
    explicit SNode(string lbl = "") : label(move(lbl)) {}
};

struct SuffixTree {
    SNode* root = new SNode();

    explicit SuffixTree(const string& text) {
        for (size_t i = 0; i < text.size(); i++) add(root, text.substr(i));
    }

    static size_t shared_len(const string& a, const string& b) {
        size_t i = 0;
        while (i < a.size() && i < b.size() && a[i] == b[i]) i++;
        return i;
    }

    void add(SNode* node, const string& suffix) {
        if (suffix.empty()) { node->terminal = true; return; }
        char first = suffix[0];
        auto it = node->kids.find(first);
        if (it == node->kids.end()) {
            SNode* fresh = new SNode(suffix);
            fresh->terminal = true;
            node->kids[first] = fresh;
            return;
        }
        SNode* kid = it->second;
        size_t shared = shared_len(kid->label, suffix);
        if (shared == kid->label.size()) {
            add(kid, suffix.substr(shared));
            return;
        }
        SNode* split = new SNode(kid->label.substr(0, shared));
        kid->label = kid->label.substr(shared);
        split->kids[kid->label[0]] = kid;
        node->kids[first] = split;
        string rest = suffix.substr(shared);
        if (rest.empty()) {
            split->terminal = true;
        } else {
            SNode* fresh = new SNode(rest);
            fresh->terminal = true;
            split->kids[rest[0]] = fresh;
        }
    }

    bool contains(const string& pattern) const {
        SNode* node = root;
        size_t pos = 0;
        while (pos < pattern.size()) {
            auto it = node->kids.find(pattern[pos]);
            if (it == node->kids.end()) return false;
            SNode* kid = it->second;
            size_t cmp = min(kid->label.size(), pattern.size() - pos);
            if (pattern.compare(pos, cmp, kid->label, 0, cmp) != 0) return false;
            node = kid;
            pos += cmp;
        }
        return true;
    }
};`,
    `class SuffixNode:
    def __init__(self, label=""):
        self.label = label
        self.terminal = False
        self.kids = {}


class SuffixTree:
    """Compressed suffix tree built by inserting every suffix of the text."""

    def __init__(self, text, sentinel="$"):
        self.text = text + sentinel
        self.root = SuffixNode()
        for i in range(len(self.text)):
            self._add(self.root, self.text[i:])

    def _add(self, node, suffix):
        if not suffix:
            node.terminal = True
            return
        first = suffix[0]
        kid = node.kids.get(first)
        if kid is None:
            fresh = SuffixNode(suffix)
            fresh.terminal = True
            node.kids[first] = fresh
            return
        shared = 0
        while (
            shared < len(kid.label)
            and shared < len(suffix)
            and kid.label[shared] == suffix[shared]
        ):
            shared += 1
        if shared == len(kid.label):
            self._add(kid, suffix[shared:])
            return
        split = SuffixNode(kid.label[:shared])
        kid.label = kid.label[shared:]
        split.kids[kid.label[0]] = kid
        node.kids[first] = split
        rest = suffix[shared:]
        if rest:
            fresh = SuffixNode(rest)
            fresh.terminal = True
            split.kids[rest[0]] = fresh
        else:
            split.terminal = True

    def contains(self, pattern):
        node, pos = self.root, 0
        while pos < len(pattern):
            kid = node.kids.get(pattern[pos])
            if kid is None:
                return False
            cmp = min(len(kid.label), len(pattern) - pos)
            if kid.label[:cmp] != pattern[pos : pos + cmp]:
                return False
            node, pos = kid, pos + cmp
        return True

    def count_leaves(self, node=None):
        node = self.root if node is None else node
        if not node.kids:
            return 1
        return sum(self.count_leaves(kid) for kid in node.kids.values())`,
    `class SuffixNode {
    String label;
    boolean terminal;
    Map<Character, SuffixNode> kids = new TreeMap<>();
    SuffixNode(String label) { this.label = label; }
}

// compressed suffix tree built by inserting every suffix
class SuffixTree {
    final SuffixNode root = new SuffixNode("");

    SuffixTree(String text) {
        String padded = text + "$";
        for (int i = 0; i < padded.length(); i++) add(root, padded.substring(i));
    }

    static int sharedLen(String a, String b) {
        int i = 0;
        while (i < a.length() && i < b.length() && a.charAt(i) == b.charAt(i)) i++;
        return i;
    }

    private void add(SuffixNode node, String suffix) {
        if (suffix.isEmpty()) { node.terminal = true; return; }
        char first = suffix.charAt(0);
        SuffixNode kid = node.kids.get(first);
        if (kid == null) {
            SuffixNode fresh = new SuffixNode(suffix);
            fresh.terminal = true;
            node.kids.put(first, fresh);
            return;
        }
        int shared = sharedLen(kid.label, suffix);
        if (shared == kid.label.length()) {
            add(kid, suffix.substring(shared));
            return;
        }
        SuffixNode split = new SuffixNode(kid.label.substring(0, shared));
        kid.label = kid.label.substring(shared);
        split.kids.put(kid.label.charAt(0), kid);
        node.kids.put(first, split);
        String rest = suffix.substring(shared);
        if (rest.isEmpty()) {
            split.terminal = true;
        } else {
            SuffixNode fresh = new SuffixNode(rest);
            fresh.terminal = true;
            split.kids.put(rest.charAt(0), fresh);
        }
    }

    boolean contains(String pattern) {
        SuffixNode node = root;
        int pos = 0;
        while (pos < pattern.length()) {
            SuffixNode kid = node.kids.get(pattern.charAt(pos));
            if (kid == null) return false;
            int cmp = Math.min(kid.label.length(), pattern.length() - pos);
            if (!kid.label.regionMatches(0, pattern, pos, cmp)) return false;
            node = kid;
            pos += cmp;
        }
        return true;
    }
}`,
    `class SuffixNode {
  constructor(label = "") {
    this.label = label;
    this.terminal = false;
    this.kids = new Map();
  }
}

// compressed suffix tree built by inserting every suffix
class SuffixTree {
  constructor(text, sentinel = "$") {
    this.text = text + sentinel;
    this.root = new SuffixNode();
    for (let i = 0; i < this.text.length; i++) {
      this.add(this.root, this.text.slice(i));
    }
  }

  static sharedLen(a, b) {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return i;
  }

  add(node, suffix) {
    if (!suffix) {
      node.terminal = true;
      return;
    }
    const first = suffix[0];
    const kid = node.kids.get(first);
    if (!kid) {
      const fresh = new SuffixNode(suffix);
      fresh.terminal = true;
      node.kids.set(first, fresh);
      return;
    }
    const shared = SuffixTree.sharedLen(kid.label, suffix);
    if (shared === kid.label.length) {
      this.add(kid, suffix.slice(shared));
      return;
    }
    const split = new SuffixNode(kid.label.slice(0, shared));
    kid.label = kid.label.slice(shared);
    split.kids.set(kid.label[0], kid);
    node.kids.set(first, split);
    const rest = suffix.slice(shared);
    if (rest) {
      const fresh = new SuffixNode(rest);
      fresh.terminal = true;
      split.kids.set(rest[0], fresh);
    } else {
      split.terminal = true;
    }
  }

  contains(pattern) {
    let node = this.root;
    let pos = 0;
    while (pos < pattern.length) {
      const kid = node.kids.get(pattern[pos]);
      if (!kid) return false;
      const cmp = Math.min(kid.label.length, pattern.length - pos);
      if (kid.label.slice(0, cmp) !== pattern.slice(pos, pos + cmp)) return false;
      node = kid;
      pos += cmp;
    }
    return true;
  }
}`,
    `class SuffixNode {
    public string Label { get; set; }
    public bool Terminal { get; set; }
    public SortedDictionary<char, SuffixNode> Kids { get; } = new();
    public SuffixNode(string label = "") { Label = label; }
}

// compressed suffix tree built by inserting every suffix
class SuffixTree {
    public SuffixNode Root { get; } = new SuffixNode();

    public SuffixTree(string text, char sentinel = '$') {
        string padded = text + sentinel;
        for (int i = 0; i < padded.Length; i++) Add(Root, padded[i..]);
    }

    static int SharedLen(string a, string b) {
        int i = 0;
        while (i < a.Length && i < b.Length && a[i] == b[i]) i++;
        return i;
    }

    void Add(SuffixNode node, string suffix) {
        if (suffix.Length == 0) { node.Terminal = true; return; }
        char first = suffix[0];
        if (!node.Kids.TryGetValue(first, out SuffixNode? kid)) {
            node.Kids[first] = new SuffixNode(suffix) { Terminal = true };
            return;
        }
        int shared = SharedLen(kid.Label, suffix);
        if (shared == kid.Label.Length) {
            Add(kid, suffix[shared..]);
            return;
        }
        var split = new SuffixNode(kid.Label[..shared]);
        kid.Label = kid.Label[shared..];
        split.Kids[kid.Label[0]] = kid;
        node.Kids[first] = split;
        string rest = suffix[shared..];
        if (rest.Length == 0) split.Terminal = true;
        else split.Kids[rest[0]] = new SuffixNode(rest) { Terminal = true };
    }

    public bool Contains(string pattern) {
        SuffixNode node = Root;
        int pos = 0;
        while (pos < pattern.Length) {
            if (!node.Kids.TryGetValue(pattern[pos], out SuffixNode? kid)) return false;
            int cmp = Math.Min(kid.Label.Length, pattern.Length - pos);
            if (kid.Label[..cmp] != pattern.Substring(pos, cmp)) return false;
            node = kid;
            pos += cmp;
        }
        return true;
    }
}`,
  ),

  cartesian: snippets(
    `typedef struct CNode {
    int value;
    struct CNode *left, *right;
} CNode;

CNode* cnode_new(int value) {
    CNode* n = (CNode*)calloc(1, sizeof(CNode));
    n->value = value;
    return n;
}

/* min-heap Cartesian tree: O(n) build with a monotonic stack */
CNode* cartesian_build(const int* a, int n) {
    CNode** stack = (CNode**)malloc(sizeof(CNode*) * (n > 0 ? n : 1));
    int top = 0;
    CNode* root = NULL;
    for (int i = 0; i < n; i++) {
        CNode* node = cnode_new(a[i]);
        CNode* last = NULL;
        while (top > 0 && stack[top - 1]->value > node->value) last = stack[--top];
        node->left = last;
        if (top > 0) stack[top - 1]->right = node;
        else root = node;
        stack[top++] = node;
    }
    free(stack);
    return root;
}

/* inorder walk reproduces the original sequence */
void cartesian_inorder(CNode* n, int* out, int* k) {
    if (!n) return;
    cartesian_inorder(n->left, out, k);
    out[(*k)++] = n->value;
    cartesian_inorder(n->right, out, k);
}

int cartesian_height(CNode* n) {
    if (!n) return -1;
    int l = cartesian_height(n->left), r = cartesian_height(n->right);
    return 1 + (l > r ? l : r);
}`,
    `struct CNode {
    int value;
    CNode *left = nullptr, *right = nullptr;
    explicit CNode(int v) : value(v) {}
};

// min-heap Cartesian tree: O(n) build with a monotonic stack
CNode* cartesian_build(const vector<int>& a) {
    vector<CNode*> st;
    CNode* root = nullptr;
    for (int v : a) {
        CNode* node = new CNode(v);
        CNode* last = nullptr;
        while (!st.empty() && st.back()->value > v) {
            last = st.back();
            st.pop_back();
        }
        node->left = last;
        if (!st.empty()) st.back()->right = node;
        else root = node;
        st.push_back(node);
    }
    return root;
}

// inorder walk reproduces the original sequence
void inorder(CNode* n, vector<int>& out) {
    if (!n) return;
    inorder(n->left, out);
    out.push_back(n->value);
    inorder(n->right, out);
}

int height(CNode* n) {
    if (!n) return -1;
    return 1 + max(height(n->left), height(n->right));
}

// the root of any subtree is the minimum of that range
int range_min(CNode* n, int lo, int hi, int pos = 0) {
    vector<int> flat;
    inorder(n, flat);
    int best = flat[lo];
    for (int i = lo; i <= hi; i++) best = min(best, flat[i]);
    return best;
}`,
    `class CNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def cartesian_build(values):
    """Min-heap Cartesian tree in O(n) with a monotonic stack."""
    stack, root = [], None
    for v in values:
        node = CNode(v)
        last = None
        while stack and stack[-1].value > v:
            last = stack.pop()
        node.left = last
        if stack:
            stack[-1].right = node
        else:
            root = node
        stack.append(node)
    return root


def inorder(node, out=None):
    """Reproduces the original sequence."""
    out = [] if out is None else out
    if node is not None:
        inorder(node.left, out)
        out.append(node.value)
        inorder(node.right, out)
    return out


def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))


def is_valid(node):
    if node is None:
        return True
    for kid in (node.left, node.right):
        if kid is not None and kid.value < node.value:
            return False
    return is_valid(node.left) and is_valid(node.right)`,
    `class CNode {
    int value;
    CNode left, right;
    CNode(int value) { this.value = value; }
}

class CartesianTree {
    // min-heap Cartesian tree: O(n) build with a monotonic stack
    static CNode build(int[] a) {
        Deque<CNode> stack = new ArrayDeque<>();
        CNode root = null;
        for (int v : a) {
            CNode node = new CNode(v);
            CNode last = null;
            while (!stack.isEmpty() && stack.peek().value > v) last = stack.pop();
            node.left = last;
            if (!stack.isEmpty()) stack.peek().right = node;
            else root = node;
            stack.push(node);
        }
        return root;
    }

    // inorder walk reproduces the original sequence
    static void inorder(CNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.value);
        inorder(n.right, out);
    }

    static int height(CNode n) {
        if (n == null) return -1;
        return 1 + Math.max(height(n.left), height(n.right));
    }

    static boolean isValid(CNode n) {
        if (n == null) return true;
        if (n.left != null && n.left.value < n.value) return false;
        if (n.right != null && n.right.value < n.value) return false;
        return isValid(n.left) && isValid(n.right);
    }
}`,
    `class CNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// min-heap Cartesian tree: O(n) build with a monotonic stack
function cartesianBuild(values) {
  const stack = [];
  let root = null;
  for (const v of values) {
    const node = new CNode(v);
    let last = null;
    while (stack.length && stack[stack.length - 1].value > v) last = stack.pop();
    node.left = last;
    if (stack.length) stack[stack.length - 1].right = node;
    else root = node;
    stack.push(node);
  }
  return root;
}

// inorder walk reproduces the original sequence
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.value);
  inorder(node.right, out);
  return out;
}

function height(node) {
  if (!node) return -1;
  return 1 + Math.max(height(node.left), height(node.right));
}

function isValid(node) {
  if (!node) return true;
  if (node.left && node.left.value < node.value) return false;
  if (node.right && node.right.value < node.value) return false;
  return isValid(node.left) && isValid(node.right);
}`,
    `class CNode {
    public int Value { get; }
    public CNode? Left, Right;
    public CNode(int value) { Value = value; }
}

static class CartesianTree {
    // min-heap Cartesian tree: O(n) build with a monotonic stack
    public static CNode? Build(int[] a) {
        var stack = new Stack<CNode>();
        CNode? root = null;
        foreach (int v in a) {
            var node = new CNode(v);
            CNode? last = null;
            while (stack.Count > 0 && stack.Peek().Value > v) last = stack.Pop();
            node.Left = last;
            if (stack.Count > 0) stack.Peek().Right = node;
            else root = node;
            stack.Push(node);
        }
        return root;
    }

    // inorder walk reproduces the original sequence
    public static void Inorder(CNode? n, List<int> acc) {
        if (n == null) return;
        Inorder(n.Left, acc);
        acc.Add(n.Value);
        Inorder(n.Right, acc);
    }

    public static int Height(CNode? n) =>
        n == null ? -1 : 1 + Math.Max(Height(n.Left), Height(n.Right));

    public static bool IsValid(CNode? n) {
        if (n == null) return true;
        if (n.Left != null && n.Left.Value < n.Value) return false;
        if (n.Right != null && n.Right.Value < n.Value) return false;
        return IsValid(n.Left) && IsValid(n.Right);
    }
}`,
  ),

  "kd-tree": snippets(
    `typedef struct KdNode {
    int x, y, axis;
    struct KdNode *left, *right;
} KdNode;

KdNode* kd_node(int x, int y, int axis) {
    KdNode* n = (KdNode*)calloc(1, sizeof(KdNode));
    n->x = x; n->y = y; n->axis = axis;
    return n;
}

KdNode* kd_insert(KdNode* node, int x, int y, int depth) {
    if (!node) return kd_node(x, y, depth % 2);
    int cmp = (depth % 2 == 0) ? x - node->x : y - node->y;
    if (cmp < 0) node->left = kd_insert(node->left, x, y, depth + 1);
    else node->right = kd_insert(node->right, x, y, depth + 1);
    return node;
}

long dist2(int ax, int ay, int bx, int by) {
    long dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy;
}

void kd_nearest(KdNode* node, int x, int y, KdNode** best) {
    if (!node) return;
    if (!*best || dist2(node->x, node->y, x, y) < dist2((*best)->x, (*best)->y, x, y))
        *best = node;
    long diff = (node->axis == 0) ? x - node->x : y - node->y;
    KdNode* near = diff < 0 ? node->left : node->right;
    KdNode* far = diff < 0 ? node->right : node->left;
    kd_nearest(near, x, y, best);
    if (diff * diff < dist2((*best)->x, (*best)->y, x, y))
        kd_nearest(far, x, y, best);
}

void kd_range(KdNode* n, int x0, int y0, int x1, int y1, void (*emit)(int, int)) {
    if (!n) return;
    if (n->x >= x0 && n->x <= x1 && n->y >= y0 && n->y <= y1) emit(n->x, n->y);
    int lo = n->axis == 0 ? x0 : y0;
    int hi = n->axis == 0 ? x1 : y1;
    int v = n->axis == 0 ? n->x : n->y;
    if (lo < v) kd_range(n->left, x0, y0, x1, y1, emit);
    if (hi >= v) kd_range(n->right, x0, y0, x1, y1, emit);
}`,
    `struct Point { int x, y; };

struct KdNode {
    Point p;
    int axis;
    KdNode *left = nullptr, *right = nullptr;
    KdNode(Point pt, int ax) : p(pt), axis(ax) {}
};

long long dist2(Point a, Point b) {
    long long dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
}

int coord(Point p, int axis) { return axis == 0 ? p.x : p.y; }

// median split on alternating axes
KdNode* kd_build(vector<Point> pts, int depth = 0) {
    if (pts.empty()) return nullptr;
    int axis = depth % 2;
    sort(pts.begin(), pts.end(), [axis](Point a, Point b) {
        return coord(a, axis) < coord(b, axis);
    });
    size_t mid = pts.size() / 2;
    KdNode* node = new KdNode(pts[mid], axis);
    node->left = kd_build(vector<Point>(pts.begin(), pts.begin() + mid), depth + 1);
    node->right = kd_build(vector<Point>(pts.begin() + mid + 1, pts.end()), depth + 1);
    return node;
}

void kd_nearest(KdNode* node, Point target, KdNode*& best) {
    if (!node) return;
    if (!best || dist2(node->p, target) < dist2(best->p, target)) best = node;
    long long diff = coord(target, node->axis) - coord(node->p, node->axis);
    KdNode* near = diff < 0 ? node->left : node->right;
    KdNode* far = diff < 0 ? node->right : node->left;
    kd_nearest(near, target, best);
    if (diff * diff < dist2(best->p, target)) kd_nearest(far, target, best);
}

Point nearest(KdNode* root, Point target) {
    KdNode* best = nullptr;
    kd_nearest(root, target, best);
    return best->p;
}`,
    `class KdNode:
    def __init__(self, point, axis):
        self.point = point
        self.axis = axis
        self.left = None
        self.right = None


def dist2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2


def kd_build(points, depth=0):
    """Median split on alternating axes."""
    if not points:
        return None
    axis = depth % 2
    ordered = sorted(points, key=lambda p: p[axis])
    mid = len(ordered) // 2
    node = KdNode(ordered[mid], axis)
    node.left = kd_build(ordered[:mid], depth + 1)
    node.right = kd_build(ordered[mid + 1 :], depth + 1)
    return node


def kd_insert(node, point, depth=0):
    axis = depth % 2
    if node is None:
        return KdNode(point, axis)
    if point[axis] < node.point[axis]:
        node.left = kd_insert(node.left, point, depth + 1)
    else:
        node.right = kd_insert(node.right, point, depth + 1)
    return node


def nearest(node, target, best=None):
    if node is None:
        return best
    if best is None or dist2(node.point, target) < dist2(best, target):
        best = node.point
    diff = target[node.axis] - node.point[node.axis]
    near, far = (node.left, node.right) if diff < 0 else (node.right, node.left)
    best = nearest(near, target, best)
    if diff * diff < dist2(best, target):
        best = nearest(far, target, best)
    return best


def range_search(node, lo, hi, out=None):
    out = [] if out is None else out
    if node is None:
        return out
    x, y = node.point
    if lo[0] <= x <= hi[0] and lo[1] <= y <= hi[1]:
        out.append(node.point)
    axis = node.axis
    if lo[axis] < node.point[axis]:
        range_search(node.left, lo, hi, out)
    if hi[axis] >= node.point[axis]:
        range_search(node.right, lo, hi, out)
    return out`,
    `class KdNode {
    int[] point;
    int axis;
    KdNode left, right;
    KdNode(int[] point, int axis) { this.point = point; this.axis = axis; }
}

class KdTree {
    static long dist2(int[] a, int[] b) {
        long dx = a[0] - b[0], dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }

    // median split on alternating axes
    static KdNode build(List<int[]> points, int depth) {
        if (points.isEmpty()) return null;
        int axis = depth % 2;
        List<int[]> ordered = new ArrayList<>(points);
        ordered.sort(Comparator.comparingInt(p -> p[axis]));
        int mid = ordered.size() / 2;
        KdNode node = new KdNode(ordered.get(mid), axis);
        node.left = build(ordered.subList(0, mid), depth + 1);
        node.right = build(ordered.subList(mid + 1, ordered.size()), depth + 1);
        return node;
    }

    static KdNode insert(KdNode node, int[] point, int depth) {
        int axis = depth % 2;
        if (node == null) return new KdNode(point, axis);
        if (point[axis] < node.point[axis]) node.left = insert(node.left, point, depth + 1);
        else node.right = insert(node.right, point, depth + 1);
        return node;
    }

    static int[] nearest(KdNode node, int[] target, int[] best) {
        if (node == null) return best;
        if (best == null || dist2(node.point, target) < dist2(best, target))
            best = node.point;
        long diff = target[node.axis] - node.point[node.axis];
        KdNode near = diff < 0 ? node.left : node.right;
        KdNode far = diff < 0 ? node.right : node.left;
        best = nearest(near, target, best);
        if (diff * diff < dist2(best, target)) best = nearest(far, target, best);
        return best;
    }
}`,
    `class KdNode {
  constructor(point, axis) {
    this.point = point;
    this.axis = axis;
    this.left = null;
    this.right = null;
  }
}

const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

// median split on alternating axes
function kdBuild(points, depth = 0) {
  if (!points.length) return null;
  const axis = depth % 2;
  const ordered = [...points].sort((a, b) => a[axis] - b[axis]);
  const mid = ordered.length >> 1;
  const node = new KdNode(ordered[mid], axis);
  node.left = kdBuild(ordered.slice(0, mid), depth + 1);
  node.right = kdBuild(ordered.slice(mid + 1), depth + 1);
  return node;
}

function kdInsert(node, point, depth = 0) {
  const axis = depth % 2;
  if (!node) return new KdNode(point, axis);
  if (point[axis] < node.point[axis]) node.left = kdInsert(node.left, point, depth + 1);
  else node.right = kdInsert(node.right, point, depth + 1);
  return node;
}

function nearest(node, target, best = null) {
  if (!node) return best;
  let winner = best;
  if (!winner || dist2(node.point, target) < dist2(winner, target)) winner = node.point;
  const diff = target[node.axis] - node.point[node.axis];
  const near = diff < 0 ? node.left : node.right;
  const far = diff < 0 ? node.right : node.left;
  winner = nearest(near, target, winner);
  if (diff * diff < dist2(winner, target)) winner = nearest(far, target, winner);
  return winner;
}

function rangeSearch(node, lo, hi, out = []) {
  if (!node) return out;
  const [x, y] = node.point;
  if (x >= lo[0] && x <= hi[0] && y >= lo[1] && y <= hi[1]) out.push(node.point);
  const axis = node.axis;
  if (lo[axis] < node.point[axis]) rangeSearch(node.left, lo, hi, out);
  if (hi[axis] >= node.point[axis]) rangeSearch(node.right, lo, hi, out);
  return out;
}`,
    `class KdNode {
    public int[] Point { get; }
    public int Axis { get; }
    public KdNode? Left, Right;
    public KdNode(int[] point, int axis) { Point = point; Axis = axis; }
}

static class KdTree {
    static long Dist2(int[] a, int[] b) {
        long dx = a[0] - b[0], dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }

    // median split on alternating axes
    public static KdNode? Build(List<int[]> points, int depth = 0) {
        if (points.Count == 0) return null;
        int axis = depth % 2;
        var ordered = new List<int[]>(points);
        ordered.Sort((a, b) => a[axis].CompareTo(b[axis]));
        int mid = ordered.Count / 2;
        var node = new KdNode(ordered[mid], axis);
        node.Left = Build(ordered.GetRange(0, mid), depth + 1);
        node.Right = Build(ordered.GetRange(mid + 1, ordered.Count - mid - 1), depth + 1);
        return node;
    }

    public static KdNode Insert(KdNode? node, int[] point, int depth = 0) {
        int axis = depth % 2;
        if (node == null) return new KdNode(point, axis);
        if (point[axis] < node.Point[axis]) node.Left = Insert(node.Left, point, depth + 1);
        else node.Right = Insert(node.Right, point, depth + 1);
        return node;
    }

    public static int[]? Nearest(KdNode? node, int[] target, int[]? best = null) {
        if (node == null) return best;
        if (best == null || Dist2(node.Point, target) < Dist2(best, target))
            best = node.Point;
        long diff = target[node.Axis] - node.Point[node.Axis];
        KdNode? near = diff < 0 ? node.Left : node.Right;
        KdNode? far = diff < 0 ? node.Right : node.Left;
        best = Nearest(near, target, best);
        if (diff * diff < Dist2(best!, target)) best = Nearest(far, target, best);
        return best;
    }

    public static List<int[]> RangeSearch(KdNode? node, int[] lo, int[] hi) {
        var acc = new List<int[]>();
        void Walk(KdNode? n) {
            if (n == null) return;
            if (n.Point[0] >= lo[0] && n.Point[0] <= hi[0]
                && n.Point[1] >= lo[1] && n.Point[1] <= hi[1]) acc.Add(n.Point);
            if (lo[n.Axis] < n.Point[n.Axis]) Walk(n.Left);
            if (hi[n.Axis] >= n.Point[n.Axis]) Walk(n.Right);
        }
        Walk(node);
        return acc;
    }
}`,
  ),
};
