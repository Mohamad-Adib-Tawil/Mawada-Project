import Foundation
import Vision
import AppKit

let root = URL(fileURLWithPath: CommandLine.arguments[1])
let names = ["محمد", "رزان", "مخملجي", "أديب", "بطايحي", "Mohamad", "Razan", "Nour", "Mokhmalji"]
let fm = FileManager.default
let enumerator = fm.enumerator(at: root, includingPropertiesForKeys: nil)!
var scanned = 0
while let url = enumerator.nextObject() as? URL {
    guard ["jpg", "jpeg", "png", "webp"].contains(url.pathExtension.lowercased()),
          let image = NSImage(contentsOf: url),
          let data = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: data),
          let cgImage = bitmap.cgImage else { continue }
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["ar-SA", "en-US"]
    request.usesLanguageCorrection = false
    do {
        try VNImageRequestHandler(cgImage: cgImage).perform([request])
        scanned += 1
        for result in request.results ?? [] {
            guard let text = result.topCandidates(1).first?.string else { continue }
            if names.contains(where: { text.localizedCaseInsensitiveContains($0) }) {
                print("\(url.path)\t\(text)")
            }
        }
    } catch { fputs("OCR failed for \(url.path): \(error)\n", stderr) }
}
fputs("Scanned \(scanned) images\n", stderr)
