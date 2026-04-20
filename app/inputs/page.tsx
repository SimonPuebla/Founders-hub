import { Suspense } from "react";
import { InputsContent } from "@/components/inputs/InputsContent";

export default function InputsPage() {
  return (
    <Suspense fallback={<div className="px-8 py-8"><div className="h-8 bg-[#111111] rounded animate-pulse w-32" /></div>}>
      <InputsContent />
    </Suspense>
  );
}
