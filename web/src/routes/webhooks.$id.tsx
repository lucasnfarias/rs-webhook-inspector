import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { WebhookDetails } from '../components/webhook-details'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/webhooks/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <Suspense
      fallback={<Loader2 className="size-5 animate-spin text-zinc-500" />}
    >
      <WebhookDetails id={id} />
    </Suspense>
  )
}
