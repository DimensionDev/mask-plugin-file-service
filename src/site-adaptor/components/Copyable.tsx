interface Props {
    className?: string
}

export function CopyableCode({ children, className }: React.PropsWithChildren<Props>) {
        // @ts-expect-error
    const onSelect = (event: React.MouseEvent<Node>) => {
        // @ts-expect-error
        const selection = getSelection()
        if (selection === null) {
            return
        }
        // @ts-expect-error
        const range = document.createRange()
        range.selectNode(event.currentTarget)
        selection.removeAllRanges()
        selection.addRange(range)
    }
    const onDeselect = () => {
        // @ts-expect-error
        getSelection()?.removeAllRanges()
    }
    const onCopy = async (event: React.MouseEvent<HTMLElement>) => {
        onSelect(event)
    }
    return (
        <code
            className={className}
            onClick={onCopy}
            onMouseEnter={onSelect}
            onMouseLeave={onDeselect}
            children={children}
        />
    )
}
