import { useEffect } from "react";
import "./App.css";
const { ipcRenderer } = window.require("electron");

const { writeFileSync, readFileSync, renameSync, unlinkSync } =
  window.require("fs");
const { join } = window.require("path");
const {
  app,
  dialog,
  Menu,
  MenuItem,
  getCurrentWindow,
  shell,
  // } = require("@electron/remote");
} = window.require("@electron/remote");

function App() {
  const documents = app.getPath("documents");
  const hello = join(documents, "hello.txt");

  console.log("process.platform", process.platform);
  console.log("node版本", process.versions.node);

  useEffect(() => {
    const cb = () => {
      console.log("早上好");
    };
    ipcRenderer.on("hi", cb);
    return () => {
      ipcRenderer.removeListener("hi", cb);
    };
  }, []);

  return (
    <div className="App">
      <div>
        <button
          onClick={() => {
            writeFileSync(hello, "你好");
          }}
        >
          新建文件
        </button>
        <button
          onClick={() => {
            console.log(readFileSync(hello).toString());
          }}
        >
          读文件
        </button>
        <button
          onClick={() => {
            renameSync(hello, join(documents, "hi.md"));
          }}
        >
          重命名文件
        </button>
        <button
          onClick={() => {
            unlinkSync(hello);
          }}
        >
          删除文件
        </button>
      </div>
      <button
        onClick={() => {
          const res = dialog.showOpenDialogSync({
            title: "导入文件中",
            properties: ["openFile", "multiSelections"],
            filters: [{ name: "文件文档txt", extensions: ["txt"] }],
          });
          console.log("res", res);
        }}
      >
        导入文件5
      </button>
      <button
        onClick={() => {
          dialog.showMessageBoxSync({
            type: "info",
            title: "提示",
            message: "注册成功",
          });
        }}
      >
        注册成功
      </button>
      <button
        onContextMenu={() => {
          const menu = new Menu();
          menu.append(
            new MenuItem({
              label: "编辑",
              click: () => {
                console.log("editing");
              },
            })
          );
          menu.append(
            new MenuItem({
              label: "删除",
              click: () => {
                console.log("deleting");
              },
            })
          );
          menu.popup({ window: getCurrentWindow() });
        }}
      >
        右键菜单
      </button>
      <div>
        <button
          onClick={() => {
            shell.openExternal("http://baidu.com");
          }}
        >
          浏览器打开百度
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            shell.openPath(hello);
          }}
        >
          打开微信开发者工具
        </button>
        <button
          onClick={() => {
            shell.showItemInFolder(hello);
          }}
        >
          打开指定文件所属的文件夹
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            shell.openPath(hello);
          }}
        >
          读取文件存储
        </button>
      </div>
    </div>
  );
}

export default App;
