class SimpleCellRenderer {
    public eGui: any;

    public init(params: any) {
        const tempDiv = document.createElement("div");
        if (params.node.group) {
            tempDiv.innerHTML =
            '<span style="border-bottom: 1px solid grey; border-left: 1px solid grey; padding: 2px;">' +
            params.value +
            "</span>";
        } else {
            tempDiv.innerHTML =
            '<span><img src="https://flags.fmcdn.net/data/flags/mini/ie.png" style="width: 20px; padding-right: 4px;"/>' +
            params.value +
            "</span>";
        }
        this.eGui = tempDiv.firstChild;
    };

    public getGui() {
        return this.eGui;
    }
}

export { SimpleCellRenderer }