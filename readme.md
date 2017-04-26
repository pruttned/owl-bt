# owl-bt

owl-bt is editor for [Behavior trees](https://en.wikipedia.org/wiki/Behavior_tree_(artificial_intelligence,_robotics_and_control)). It has been inspired by [Unreal engine behavior trees](https://docs.unrealengine.com/latest/INT/Engine/AI/BehaviorTrees/NodeReference/index.html) in a way, that it supports special node items like decorators and services. This makes trees smaller and much more readable.

## Why
owl-bt has been created because we needed a behavior tree editor for our game [Tendril: Echo Received](https://forums.tigsource.com/index.php?topic=60709.0), where we are focusing on live npc behavior. 

We have tried some of the existing solutions, but they haven't meet our requirements like:
- focus on content and not on layout
- open format - we did not want to be bound to a specific game engine. For instance, we have created some of our game prototypes in Unity and the game itself is developed in MonoGame. In this way, we were able to take behavior trees from prototypes and use them directly in the game itself.
- ability to fully define item types
- to have fun developing it ;)

## Install
```sh
npm install owl-bt -g
```
## Usage
- help
```sh
owlbt -h
```
- Create a new project
```sh
cd <project-dir>
owlbt i
```
- Create a new tree (tree must be under an existing project)
```sh
owlbt c <tree-path>
```

- Open an existing tree
```sh
owlbt c path
```

## Configuration
owl-bt runs as a service on port `8955` by default. This can be changed in config file `.owlbtrc`, that must be created in the user`s home directory.

```json
{
	"port" : 1234
}
```

## Tree items
![bt node](./resource/readme/node.png)

In owl-bt, there are three types of items:

- *Node* - represents a single task that can be executed at once or in multiple ticks. Composite nodes may contain child nodes.
- *Decorator* - node sub item, that guards access to its node and transforms node's return value. 
  - It is possible to mark decorator as periodic - represents, that the decorator should be reevaluated each tick, if its node is on the execution path.
- *Service* - node sub item, that executes a specific task at given times, if its node is on the execution path.

## Features
- Automatic layout - In order to focus only on content creation, there is no option for manually layout the tree. Tree is laid out automatically.
- Keyboard control - Almost entire tree can be created and edited using just keyboard. *owl-bt* contains command palette as in *Sumblime Text*. It can be accessed through `ctrl+shift+p`

![bt node](./resource/readme/command-palette.gif)

- Hot project reload - each change to project file is instantly updated in running editor instance. Therefore it is easy to define or update node items without reloading tree, that is currently being edited. 

![bt node](./resource/readme/hot-reload.gif)

- Undo/redo - owl-bt supports undo/redo for all actions
- Json format - trees and project are stored as simple json files, which makes it easy to integrate with more or less any game engine

## Project file

Project file defines all nodes and node item types that can be used in trees.

### Node
- *name* - (required) node type name 
- *icon* - node icon (name of the icon from [font-awesome](http://fontawesome.io/icons/) without `fa-` prefix)
- *description* - node description. It may contain placeholders for properties `{{PropertyName}}`
- *isComposite* - whether node may contain another child nodes
- *properties* - list of node properties (see [property](#Property) definition)

### Decorator
- *name* - (required) decorator type name 
- *icon* - decorator icon (name of the icon from [font-awesome](http://fontawesome.io/icons/) without `fa-` prefix)
- *description* - decorator description. It may contain placeholders for properties `{{PropertyName}}`
- *properties* - list of decorator properties (see [property](#Property) definition)

### Service
- *name* - (required) service type name 
- *icon* - service icon (name of the icon from [font-awesome](http://fontawesome.io/icons/) without `fa-` prefix)
- *description* - service description. It may contain placeholders for properties `{{PropertyName}}`
- *properties* - list of service properties (see [property](#Property) definition)

### Property
- *name* - (required)
- *default* - default value
- *type* - type of the property
  - *string*
  - *number*
  - *bool*
  - *enum*
- *values*- (required for enum type) - list of possible enum values
- *min*- (for number type) - min allowed value
- *max*- (for number type) - max allowed value


Example:
```json
{
  "nodes": [
    {
      "name": "SetAlertLevel",
      "icon": "exclamation",
      "description": "Set alert level to \"{{Level}}\"",
      "isComposite": false,
      "properties": [
        {
          "name": "Level",
          "default": "None",
          "type": "enum",
          "values": [
            "None",
            "Investigate",
            "HighAlert",
            "Panic"
          ]
        }
      ]
    }
  ],
  "decorators": [
    {
      "name": "HasZoneReportedEnemy",
      "icon": "phone",
      "properties": [
        {
          "name": "MaxReportAge",
          "default": 1,
          "type": "number"
        }
      ]
    }
  ],
  "services": [
    {
      "name": "ReadPlayerPos",
      "icon": "pencil",
      "description": "Store player pos to \"{{BlackboardKey}}\"",
      "properties": [
        {
          "name": "BlackboardKey",
          "default": "Target",
          "type": "string"
        }
      ]
    }
  ]
}
```

## Tree file
```json
{
	"type": "Selector",
	"name": "rootNode",
	"childNodes": [
		{
			"type": "Sequence",
			"services": [
				{
					"type": "Sample service"
				}
			],
			"decorators": [
				{
					"type": "IsBlackboardValueSet",
					"properties": [
						{
							"name": "Field",
							"value": "myValue"
						}
					],
					"periodic": true
				}
			]
		}
	]
}
```
