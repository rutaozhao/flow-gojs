<template>
  <div>
    <el-container class="report-main-container">
      <el-header height="30px" style="position:relative;border-bottom: solid 1px #ddd;">
        <div style="height:30px;line-height:30px;width:100%;">
          <div style="float:left;height:100%">
            <i class="fa fa-floppy-o  fa-lg" aria-hidden="true" @click="save()"/>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" style="position:relative;border-right: solid 1px #ddd;">
          <div id="myPaletteDiv" style="width: 100%; height:100%;"/>
        </el-aside>
        <el-main style="padding:0">
          <div id="myDiagramDiv" style="width:100%;height:100%"/>
        </el-main>
      </el-container>
    </el-container>
    <div>
      <el-dialog
        :visible.sync="centerDialogVisible"
        title="请输入任务名称"
        width="40%"
        center>
        <el-form label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="name" style="width:300px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add()">提交</el-button>
            <el-button @click="centerDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :visible.sync="conditionDialogVisible"
        title="请输入参数"
        width="50%"
        center>
        <div><i class="el-icon-plus" style="float:right; margin:-10px 10px" @click="fields.push( { name: 'condition', info: '', color: '#FFB900', figure: '', conditions: [{ action:null,source: null, rule: null, value: null }]})"/></div>
        <el-form label-width="120px">
          <div v-for="(item,index) in fields" :key="item.name">
            <el-card shadow="hover" class="margin-top-15">
              <div slot="header">
                <span class="border-left-bold"><el-input v-model="item.name"/></span>
                <i class="el-icon-close" style="float: right; padding: 3px 0" @click="fields.splice(index,1)"/>
              </div>
              <div style="margin-bottom:15px">
                <el-row><i class="el-icon-plus" style="float:right" @click="item.conditions.push({ action:null,source: null, rule: null, value: null })"/></el-row>
              </div>
              <div v-for="(condition,index) in item.conditions" :key="index" >
                <div v-if="index!==0" style="margin-bottom:15px">
                  <el-row>
                    <el-select v-model="condition.condition" placeholder="请选择关系">
                      <el-option
                        v-for="item in relationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-row>
                </div>
                <el-row :gutter="10">
                  <el-col :span="6">
                    <el-select v-model="condition.action" placeholder="请选择节点">
                      <el-option
                        v-for="item in nodeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="condition.source"/>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="condition.rule" placeholder="请选择条件">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model ="condition.value"/>
                  </el-col>
                </el-row>
                <div style="margin-top:15px">
                  <el-row><i class="el-icon-close" style="float:right" @click="item.conditions.splice(index,1)"/></el-row>
                </div>
              </div>
            </el-card>
          </div>
          <div align="center" style="margin-top:15px">
            <el-button type="primary" @click="conditionAdd()">提交</el-button>
            <el-button @click="conditionDialogVisible=false">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :visible.sync="actionDialogVisible"
        title="配置参数"
        width="60%"
        center>
        <div>
          <el-form :inline="true">
            <el-form-item>
              <el-select v-model="actionNode.appInfo" placeholder="请选择应用" @change="getAppDetail">
                <el-option
                  v-for="item in appOptions"
                  :key="item.id"
                  :label="item.applicationName"
                  :value="item.applicationName+'--'+item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="actionNode.confInfo" placeholder="请选择配置">
                <el-option
                  v-for="item in confOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name+'--'+item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="actionNode.actionInfo" placeholder="请选择动作" @change="getParamsByActionName">
                <el-option
                  v-for="item in actionOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="actionNode.paramInfo.length>0" style="margin-bottom:20px">
            <el-table
              :data="actionNode.paramInfo"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="参数名"
                width="180"/>
              <el-table-column
                label="参数值"
                width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="example"
                width="180"
                label="Example"/>
              <el-table-column
                prop="require"
                label="Require"/>
            </el-table>
          </div>
          <div>
            <div align="center" style="margin-top:15px">
              <el-button type="primary" @click="nodeDialogVisible=true">确定</el-button>
              <el-button @click="actionDialogVisible=false">取消</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :visible.sync="nodeDialogVisible"
        title="请输入节点名称"
        width="40%"
        center>
        <el-form label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="actionNode.name" style="width:300px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="actionNodeAdd()">提交</el-button>
            <el-button @click="nodeDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import go from 'gojs'
const $ = go.GraphObject.make
export default {
  data () {
    return {
      // 场景列表
      isDevops: false,
      devopsList: [],
      selectedHosts: [], // 回现主机多选框
      listQuery: {
        page: 1,
        per_page: 10,
        sort: '+id',
        q: {
          category_eq: ''
        }
      },
      total: 0,
      listLoading: false,
      application: {},
      name: '',
      senceParams: {},
      dataForm: [], // 回现参数
      highParams: {content: {hosts: { }}}, // 回现高级参数
      type: '0', // 回现执行方式
      sceneDetailDialogVisible: false, // 场景详情
      nodeDialogVisible: false,
      centerDialogVisible: false,
      conditionDialogVisible: false,
      actionDialogVisible: false,
      myDiagram: null,
      node: {
        params1: '',
        params2: ''
      },
      fields: [],
      options: [{
        value: '==',
        label: '=='
      }, {
        value: '!=',
        label: '!='
      }, {
        value: '>=',
        label: '>='
      }, {
        value: '<=',
        label: '<='
      }, {
        value: '>',
        label: '>'
      }, {
        value: '<',
        label: '<'
      }],
      nodeOptions: [],
      relationOptions: [
        { label: 'AND',
          value: 'AND' },
        { label: 'OR',
          value: 'OR' }],
      appOptions: [], // 应用列表
      confOptions: [], // 配置列表
      actionOptions: [], // 动作列表
      actionNode: {
        name: 'Action',
        actionInfo: '', // 动作信息
        appInfo: '', // 应用信息
        confInfo: '', // 配置信息
        paramInfo: []// 参数信息
      },
      relationData: {
        class: 'go.GraphLinksModel',
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        nodeDataArray: {},
        linkDataArray: {}
      }
    }
  },
  mounted () {
    this.init()
    // this.getAppList()
  },
  methods: {
    init () {
      const self = this
      if (this.myDiagram1 && this.myDiagram1.div) {
        this.myDiagram1.div = null
      }
      this.myDiagram1 =
              $(go.Diagram, 'myDiagramDiv',
                {
                  initialContentAlignment: go.Spot.Left,
                  initialAutoScale: go.Diagram.UniformToFill,
                  layout: $(go.LayeredDigraphLayout, { direction: 0 }),
                  // 'LinkDrawn': showLinkLabel, // this DiagramEvent listener is defined below
                  // 'LinkRelinked': showLinkLabel,
                  'undoManager.isEnabled': true // 启用Ctrl-Z撤销和Ctrl-Y重做功能
                }
              )
      function nodeStyle () {
        return [
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center
          }
        ]
      }
      function textStyle () {
        return {
          font: 'bold 11pt Helvetica, Arial, sans-serif',
          stroke: 'whitesmoke'
        }
      }
      var conditionContextMenu =
            $('ContextMenu',
              this.makeButton('edit',
                function (e, node) { // OBJ is this Button
                  // console.log(node)
                  self.nodeOptions = []
                  self.conditionDialogVisible = true
                  self.fields = e.targetObject.part.data.fields
                  var nodes = self.myDiagram1.nodes
                  nodes.each(node => {
                    if (node.data.category === 'Action') {
                      self.nodeOptions.push({label: node.data.name, value: node.data.key})
                    }
                  })
                }),
              this.makeButton('delete', function (e, node) {
                e.diagram.commandHandler.deleteSelection()
              })
            )
      var startEndContextMenu = $('ContextMenu',
        this.makeButton('delete', function (e, node) {
          e.diagram.commandHandler.deleteSelection()
        }))
      var actionContextMenu =
            $('ContextMenu',
              this.makeButton('edit',
                function (e, node) { // OBJ is this Button
                  self.actionDialogVisible = true
                  self.isDevops = false
                  self.selectedHosts = []
                  self.dataForm = []
                  self.type = '0'
                  self.highParams = {content: {hosts: {}}}
                  // console.log(e.targetObject.part.data.params)
                  if (e.targetObject.part.data.params === undefined) {
                    self.actionNode = {
                      name: 'Action',
                      actionInfo: '', // 动作信息
                      appInfo: '', // 应用信息
                      confInfo: '', // 配置信息
                      paramInfo: []// 参数信息
                    }
                    self.confOptions = []
                    self.actionOptions = []
                  } else if (e.targetObject.part.data.app === 'ac_devops') {
                    self.actionNode = e.targetObject.part.data.params
                    self.getParamsByActionName()
                    self.actionNode.paramInfo = []
                    self.selectedHosts = e.targetObject.part.data.params.selectedHosts
                    self.dataForm = e.targetObject.part.data.params.variables
                    self.type = e.targetObject.part.data.params.category.toString()
                    self.highParams = e.targetObject.part.data.params.parameter
                    self.goSceneDetail(e.targetObject.part.data.params.oid)
                  } else {
                    self.actionNode = JSON.parse(JSON.stringify(e.targetObject.part.data.params))
                    self.getAppDetail()
                    self.actionNode.confInfo = e.targetObject.part.data.params.confInfo
                    self.actionNode.actionInfo = e.targetObject.part.data.params.actionInfo
                  }
                }),
              this.makeButton('delete', function (e, node) {
                e.diagram.commandHandler.deleteSelection()
              })
            )

      this.myDiagram1.linkTemplate =
              $(go.Link,
                {
                  routing: go.Link.Orthogonal,
                  corner: 5,
                  relinkableFrom: true,
                  relinkableTo: true
                },
                $(go.Shape, { stroke: 'gray', strokeWidth: 2 }),
                $(go.Shape, { stroke: 'gray', fill: 'gray', toArrow: 'Standard' })
              )
      var fieldTemplate =
                $(go.Panel, 'TableRow', // this Panel is a row in the containing Table
                  new go.Binding('portId', 'name'), // this Panel is a "port"
                  {
                    background: 'transparent', // so this port's background can be picked by the mouse
                    fromSpot: go.Spot.Right, // links only go from the right side to the left side
                    toSpot: go.Spot.Left,
                    // allow drawing links from or to this port:
                    fromLinkable: true,
                    toLinkable: false
                  },
                  $(go.Shape,
                    {
                      width: 12,
                      height: 12,
                      column: 0,
                      strokeWidth: 2,
                      margin: 4,
                      // but disallow drawing links from or to this shape:
                      fromLinkable: false,
                      toLinkable: false
                    },
                    new go.Binding('figure', 'figure'),
                    new go.Binding('fill', 'color')),
                  $(go.TextBlock,
                    {
                      margin: new go.Margin(0, 5),
                      column: 1,
                      font: 'bold 13px sans-serif',
                      alignment: go.Spot.Left,
                      // editable: true,
                      // and disallow drawing links from or to this text:
                      fromLinkable: false,
                      toLinkable: false
                      // doubleClick:{}
                    },
                    new go.Binding('text', 'name')),
                  $(go.TextBlock,
                    { margin: new go.Margin(0, 5), column: 2, font: '13px sans-serif', alignment: go.Spot.Left },
                    new go.Binding('text', 'info'))
                )
      self.myDiagram1.nodeTemplateMap.add('Step',
        $(go.Node, 'Table', nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(go.Panel, 'Auto',
            $(go.Shape, 'Rectangle',
              { fill: '#00A9C9', strokeWidth: 0 },
              new go.Binding('figure', 'figure')),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                minSize: new go.Size(80, 10),
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                textAlign: 'center'
                // editable: true
              },
              new go.Binding('text').makeTwoWay())
          ), {
            doubleClick: function (e, node) {
              // self.nodeDialogVisible = true
            }
          },
          // four named ports, one on each side:
          self.makePortNoVisible('T', go.Spot.Top, go.Spot.Top, false, true),
          self.makePortNoVisible('L', go.Spot.Left, go.Spot.Left, true, true),
          self.makePortNoVisible('R', go.Spot.Right, go.Spot.Right, true, true),
          self.makePortNoVisible('B', go.Spot.Bottom, go.Spot.Bottom, true, false),
          {
            contextMenu: startEndContextMenu
          }
        ))

      self.myDiagram1.nodeTemplateMap.add('Action',
        $(go.Node, 'Auto', nodeStyle(),
          new go.Binding('text', 'name'),

          // bind the Part.layerName to control the Node's layer depending on whether it isSelected
          // define the node's outer shape
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'SHAPE',
              strokeWidth: 0,
              portId: '',
              fromLinkable: true,
              toLinkable: true,
              cursor: 'pointer'
            }, new go.Binding('fill', 'color')),
          // define the panel where the text will appear
          $(go.Panel, 'Table',
            {
              padding: 2,
              minSize: new go.Size(80, 10),
              maxSize: new go.Size(150, 999),
              margin: new go.Margin(5, 10, 10, 10),
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
            $(go.TextBlock, // the name
              {
                row: 0,
                column: 0,
                columnSpan: 5,
                font: 'bold 11pt sans-serif',
                // editable: true,
                isMultiline: false,
                stroke: 'white',
                minSize: new go.Size(10, 14),
                alignment: go.Spot.Center,

                name: 'name'
              },
              new go.Binding('text', 'name').makeTwoWay()),
            $(go.TextBlock, '应用: ', { font: 'bold 9pt sans-serif', stroke: 'whitesmoke' },
              { row: 2, column: 0 }),
            $(go.TextBlock, { font: 'bold 9pt sans-serif', stroke: 'whitesmoke' },
              {
                row: 2,
                column: 1,
                columnSpan: 4,
                // editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3),
                name: 'app'
              },
              new go.Binding('text', 'app').makeTwoWay()),
		        $(go.TextBlock, '配置: ', { font: 'bold 9pt sans-serif', stroke: 'whitesmoke' },
              { row: 3, column: 0 }),
            $(go.TextBlock, { font: 'bold 9pt sans-serif', stroke: 'whitesmoke' },
              {
                row: 3,
                column: 1,
                columnSpan: 4,
                // editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3),
                name: 'conf'
              },
              new go.Binding('text', 'conf').makeTwoWay()),
            $(go.TextBlock, '动作: ', { font: 'bold 9pt sans-serif', stroke: 'whitesmoke' },
              { row: 4, column: 0 }),
            $(go.TextBlock, { font: 'bold 9pt sans-serif', stroke: 'whitesmoke' },
              {
                row: 4,
                column: 1,
                columnSpan: 4,
                // editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3),
                name: 'action'
              },
              new go.Binding('text', 'action').makeTwoWay())

          ),
          {
            contextMenu: actionContextMenu
          }
        )
      )

      self.myDiagram1.nodeTemplateMap.add('Conditional',
        $(go.Node, 'Auto', nodeStyle(),
          // new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          // this rectangular shape surrounds the content of the node
          $(go.Shape,
            { fill: '#EEEEEE' }),
          // the content consists of a header and a list of items
          $(go.Panel, 'Vertical',
            // this is the header for the whole node
            $(go.Panel, 'Auto',
              { stretch: go.GraphObject.Horizontal }, // as wide as the whole node
              $(go.Shape,
                { fill: '#1570A6', stroke: null }),
              $(go.TextBlock,
                {
                  alignment: go.Spot.Center,
                  margin: 2,
                  stroke: 'white',
                  textAlign: 'center',
                  // editable: true,
                  font: 'bold 12pt sans-serif'
                },
                new go.Binding('text', 'key'))),
            // this Panel holds a Panel for each item object in the itemArray;
            // each item Panel is defined by the itemTemplate to be a TableRow in this Table
            $(go.Panel, 'Table',
              {
                padding: 2,
                minSize: new go.Size(80, 10),
                defaultStretch: go.GraphObject.Horizontal,
                itemTemplate: fieldTemplate
              },
              new go.Binding('itemArray', 'fields')
            ) // end Table Panel of items
          ), // end Vertical Panel
          {
            doubleClick: function (e, node) {
              // console.log(node)
              node.data.fields = self.testData
              e.targetObject.part.data.fields = self.testData
              node.updateTargetBindings()
            }
          },
          self.makePortNoVisible('L', go.Spot.Left, go.Spot.Left, true, true),
          {
            contextMenu: conditionContextMenu
          }

        )
      )
      self.myDiagram1.nodeTemplateMap.add('Start',
        $(go.Node, 'Table', nodeStyle(),
          $(go.Panel, 'Auto',
            $(go.Shape, 'Circle',
              { minSize: new go.Size(40, 40), strokeWidth: 0 }, new go.Binding('fill', 'color')),
            $(go.TextBlock, 'Start', textStyle(),
              new go.Binding('text'))
          ),
          // three named ports, one on each side except the top, all output only:
          // self.makePortNoVisible('L', go.Spot.Left, go.Spot.Left, true, false),
          self.makePortNoVisible('R', go.Spot.Right, go.Spot.Right, true, false),
          // self.makePortNoVisible('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
          {
            contextMenu: startEndContextMenu
          }
        ))

      self.myDiagram1.nodeTemplateMap.add('End',
        $(go.Node, 'Table', nodeStyle(),
          $(go.Panel, 'Auto',
            $(go.Shape, 'Circle',
              { minSize: new go.Size(40, 40), strokeWidth: 0 }, new go.Binding('fill', 'color')),
            $(go.TextBlock, 'End', textStyle(),
              new go.Binding('text'))
          ),
          // three named ports, one on each side except the bottom, all input only:
          // self.makePortNoVisible('T', go.Spot.Top, go.Spot.Top, false, true),
          self.makePortNoVisible('L', go.Spot.Left, go.Spot.Left, false, true),
          // self.makePortNoVisible('R', go.Spot.Right, go.Spot.Right, false, true)
          {
            contextMenu: startEndContextMenu
          }
        ))
      // Make link labels visible if coming out of a "conditional" node.
      // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
      // function showLinkLabel (e) {
      //   var label = e.subject.findObject('LABEL')
      //   if (label !== null) label.visible = (e.subject.fromNode.data.category === 'Conditional')
      // }
      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      self.myDiagram1.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
      self.myDiagram1.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal
      // initialize the Palette that is on the left side of the page
      const myPalette =
                $(go.Palette, 'myPaletteDiv', // must name or refer to the DIV HTML element
                  {
                    nodeTemplateMap: self.myDiagram1.nodeTemplateMap, // share the templates used by myDiagram1
                    model: new go.GraphLinksModel([ // specify the contents of the Palette
                      { category: 'Start', text: 'Start', color: '#79C900' },
                      { category: 'Step', text: 'Step' },
                      { category: 'End', text: 'End', color: '#DC3C00' },
                      { category: 'Action', name: 'Action', color: '#00A9C9' },
                      { category: 'Conditional',
                        key: 'condition',
                        fields: [
                          { name: 'fieldA', info: '', color: '#FFB900', figure: 'Diamond', conditions: [{ action: null, source: null, rule: null, value: null }] },
                          { name: 'fieldB', info: '', color: '#F25022', figure: 'Rectangle', conditions: [{ action: null, source: null, rule: null, value: null }] }
                        ] }
                    ])
                  })
      self.load()
      // })
    },
    load () {
      this.myDiagram1.model = go.Model.fromJson(this.relationData)
    },
    save () {
      this.centerDialogVisible = true
    // console.log(this.myDiagram1.model.toJson())
    },
    getAppDetail () {
      // const arr = this.actionNode.appInfo.split('--')
      // const id = arr[1]
      // const name = arr[0]
      // this.actionNode.actionInfo = ''
      // this.actionNode.confInfo = ''
      // getConfByAppId({ appid: id }).then(res => {
      //   this.confOptions = res.data.appconfig
      // })
      // getActionsByAppName({ appName: name }).then(res => {
      //   this.actionOptions = res.data.actions
      // })
    },
    getParamsByActionName () {
      // if (this.actionNode.appInfo.split('--')[0] === 'ac_devops') {
      //   this.actionNode.paramInfo = []
      //   this.listLoading = true
      //   this.isDevops = true
      //   fetchList(this.listQuery).then(response => {
      //     this.devopsList = response.data.data
      //     this.total = response.data.meta.total
      //     this.listLoading = false
      //   })
      // } else {
      //   this.isDevops = false
      //   this.actionNode.paramInfo = this.actionOptions.find((x) => {
      //     return x.name == this.actionNode.actionInfo
      //   }).parameters
      // }
    },
    goSceneDetail (id) {
      this.sceneDetailDialogVisible = true
      this.loading = true
      // 节点原来绑定的id
      // var nodeSelection = this.myDiagram1.selection
      // const self = this

      // nodeSelection.each(function(nodeOrLink) {
      //   //console.log(nodeOrLink.data.params)
      // const nodeSceneid=  ( nodeOrLink.data.params===undefined||nodeOrLink.data.params===null)?'':nodeOrLink.data.params.template_id
      //      if(nodeSceneid===row.id){
      //       self.dataForm =nodeOrLink.data.params
      //      }else{
      //        self.dataForm={}
      //     }
      // })
      // fetchApplication(id).then(response => {
      //   this.application = response.data.data
      //   this.loading = false
      // })
    },
    sceneBind (params) {
      this.senceParams = params
      this.nodeDialogVisible = true
    },
    actionNodeAdd () {
      var nodeSelection = this.myDiagram1.selection
      const self = this
      nodeSelection.each(function (nodeOrLink) {
        if (self.actionNode.appInfo.split('--')[0] === 'ac_devops') {
          self.senceParams.appInfo = self.actionNode.appInfo
          self.senceParams.confInfo = self.actionNode.confInfo
          self.senceParams.actionInfo = self.actionNode.actionInfo
          self.senceParams.name = self.actionNode.name
          nodeOrLink.data.params = self.senceParams
        } else {
          nodeOrLink.data.params = self.actionNode
        }
        nodeOrLink.data.app = self.actionNode.appInfo.split('--')[0]
        nodeOrLink.data.conf = self.actionNode.confInfo.split('--')[0]
        nodeOrLink.data.action = self.actionNode.actionInfo
        nodeOrLink.data.name = self.actionNode.name
        nodeOrLink.updateTargetBindings()
      })
      this.actionDialogVisible = false
      this.nodeDialogVisible = false
      this.sceneDetailDialogVisible = false
    },
    add () {
      // const flow = { name: this.name, flowData: this.myDiagram1.model.toJson() }
      // // console.log(flow)//key 为“”会丢失
      // insert(flow).then(res => {
      //   if (res.data.code === 200) {
      //     this.$message({
      //       message: '保存成功',
      //       type: 'success'
      //     })
      //     this.$router.push({ path: 'list' })
      //   }
      // })
    },
    // nodeAdd() {
    //   var nodeSelection = this.myDiagram1.selection
    //   const self = this
    //   nodeSelection.each(function(nodeOrLink) {
    //     nodeOrLink.data.params = self.node
    //   })
    //   this.nodeDialogVisible = false
    // },
    conditionAdd () {
      var nodeSelection = this.myDiagram1.selection
      // console.log(nodeSelection[0].data)
      const self = this
      nodeSelection.each(function (nodeOrLink) {
        nodeOrLink.data.fields = self.fields
        nodeOrLink.updateTargetBindings()
      })
      this.conditionDialogVisible = false
    },
    makePortNoVisible (name, align, spot, output, input) {
      var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
      // the port is basically just a transparent rectangle that stretches along the side of the node,
      // and becomes colored when the mouse passes over it
      return $(go.Shape,
        {
          fill: 'transparent', // changed to a color in the mouseEnter event handler
          strokeWidth: 0, // no stroke
          width: horizontal ? 30 : 8, // if not stretching horizontally, just 8 wide
          height: !horizontal ? 30 : 8, // if not stretching vertically, just 8 tall
          alignment: align, // align the port on the main Shape
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
          portId: name, // declare this object to be a "port"
          fromSpot: spot, // declare where links may connect at this port
          fromLinkable: output, // declare whether the user may draw links from here
          toSpot: spot, // declare where links may connect at this port
          toLinkable: input, // declare whether the user may draw links to here
          cursor: 'pointer', // show a different cursor to indicate potential link point
          mouseEnter: function (e, port) { // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)'
          },
          mouseLeave: function (e, port) {
            port.fill = 'transparent'
          }
        })
    },
    makeButton (text, action, visiblePredicate) {
      return $('ContextMenuButton',
        $(go.TextBlock, text),
        { click: action },
        // don't bother with binding GraphObject.visible if there's no predicate
        visiblePredicate ? new go.Binding('visible', '', function (o, e) { return o.diagram ? visiblePredicate(o, e) : false }).ofObject() : {})
    }

  }

}
</script>
<style>
.fa-lg {
    font-size: 1.33333333em;
    line-height: .75em;
    vertical-align: -15%;
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
}
.report-main-container {
  min-height: calc(100vh - 80px);
  height: auto;
}

.header {
  line-height: 50px;
  border-bottom: solid 1px #ddd;
}

.main-padding-0 {
  padding: 0;
}
.header-no-border,
.main-no-border {
  border-right: 0;
}

.collapse-controller-wrap {
    margin: 0 0 15px;
  }

.section-text {
  border-left: solid 2px #229a0c;
  padding-left: 6px;
  font-size: 16px;
  margin-top: 0;
}
</style>

<style>
.report-list-collapse .el-collapse-item__header{
  font-size: 15px
}
</style>
