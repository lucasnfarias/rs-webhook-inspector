import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import WebHooksListItem from './webhooks-list-item'
import { webhookListSchema } from '../http/schemas/webhooks'
import { Loader2, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CodeBlock } from './ui/code-block'

export function WebHooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<string | null>(null)
  const [isGeneratingHandler, setIsGeneratingHandler] = useState(false)

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['webhooks'],
      queryFn: async ({ pageParam }) => {
        const url = new URL('http://localhost:3333/api/webhooks')

        if (pageParam) url.searchParams.set('cursor', pageParam)

        const response = await fetch(url.toString())
        const data = await response.json()

        return webhookListSchema.parse(data)
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined
      },
      initialPageParam: undefined as string | undefined,
    })

  const webhooks = data.pages.flatMap((page) => page.webhooks)

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.2,
      },
    )

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  function handleWebhookChecked(id: string) {
    if (checkedWebhooksIds.includes(id)) {
      setCheckedWebhooksIds((state) =>
        state.filter((webhookId) => webhookId !== id),
      )
    } else {
      setCheckedWebhooksIds((state) => [...state, id])
    }
  }

  async function handleGenerateHandler() {
    try {
      setIsGeneratingHandler(true)

      const response = await fetch('http://localhost:3333/api/generate-handler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookIds: checkedWebhooksIds,
      }),
    })

    type GeneratedHandlerResponse = {
      code: string
    }

    const data: GeneratedHandlerResponse = await response.json()

    setGeneratedHandlerCode(data.code)
    } catch (error) {
      console.error('Error generating handler:', error)
    } finally {
      setIsGeneratingHandler(false)
    }
  }

  const isSomeWebhookChecked = checkedWebhooksIds.length > 0

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          <button
            disabled={!isSomeWebhookChecked || isGeneratingHandler}
            className="bg-indigo-400 text-white size-8 w-full rounded-lg  flex items-center justify-center gap-3 font-medium py-2.5 mb-3 text-sm disabled:opacity-50"
            onClick={handleGenerateHandler}
          >
            {isGeneratingHandler ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            Gerar handler
          </button>

          {webhooks.map((webhook) => (
            <WebHooksListItem
              key={webhook.id}
              webhook={webhook}
              onWebhookChecked={handleWebhookChecked}
              isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
            />
          ))}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-5 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generatedHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />

          <Dialog.Content className="flex items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="bg-zinc-900 max-w-[75vw] p-4 rounded-lg border border-zinc-800 max-h-[90vh] overflow-y-auto">
              <CodeBlock language="typescript" code={generatedHandlerCode} />
            </div>
          </Dialog.Content>

        </Dialog.Root>
      )}
    </>
  )
}
